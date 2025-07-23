// 귀찮아서 하나에 때려 박음
// IAM 역할 할당 코드
// 25 컨트롤러 관련 개선 코드 없음

require('dotenv').config();

const ip = require('ip');
const express = require('express');
const { DynamoDBClient, ScanCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const exceljs = require('exceljs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 25000,  // ping 타임아웃 20초로 늘림
  pingInterval: 25000,  // ping 간격 25초로 유지
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ['websocket']
});

const port = 2004;

// AWS SDK 설정. IAM 역할 할당이 불가능한 환경에서 사용.
const dynamoDBClient = new DynamoDBClient({
  region: 'ap-northeast-2'
});

app.use(cors());
app.use(express.json());

function getKoreaTime() {
  const koreaTime = new Date(Date.now() + (9 * 60 * 60 * 1000)); // UTC + 9시간
  return koreaTime.toISOString().replace('T', ' ').split('.')[0];
}

// 16진수를 거꾸로 배열하고 10진수로 변환하는 함수
function parseData(buffer) {
  const parsedData = {};

  parsedData.RPM = parseInt(buffer.slice(0, 2).reverse().toString('hex'), 16);             // 0~1 바이트 (거꾸로)
  parsedData.MOTOR_CURRENT = parseInt(buffer.slice(2, 4).reverse().toString('hex'), 16);   // 2~3 바이트
  parsedData.BATTERY_VOLTAGE = parseInt(buffer.slice(4, 6).reverse().toString('hex'), 16); // 4~5 바이트
  parsedData.THROTTLE_SIGNAL = parseInt(buffer.slice(6, 8).reverse().toString('hex'), 16); // 6~7 바이트
  parsedData.CONTROLLER_TEMPERATURE = parseInt(buffer.slice(8, 10).reverse().toString('hex'), 16); // 8~9 바이트
  parsedData.SPEED = parseInt(buffer.slice(10, 12).reverse().toString('hex'), 16);         // 10~11 바이트
  parsedData.BATTERY_PERCENT = parseInt(buffer.slice(12, 14).reverse().toString('hex'), 16); // 12~13 바이트

  return parsedData;
}

// DynamoDB에 데이터를 저장하는 함수
async function saveToDynamoDB(data) {
  const params = {
    TableName: '24_icc_ev_database',
    Item: {
      "timestamp": { S: getKoreaTime() },
      // 값이 undefined일 경우 기본값 0으로 대체
      "RPM": { N: String(data.RPM || 0) },  
      "MOTOR_CURRENT": { N: String(data.MOTOR_CURRENT || 0) },
      "BATTERY_VOLTAGE": { N: String(data.BATTERY_VOLTAGE || 0) },
      "THROTTLE_SIGNAL": { N: String(data.THROTTLE_SIGNAL || 0) },
      "CONTROLLER_TEMPERATURE": { N: String(data.CONTROLLER_TEMPERATURE || 0) },
      "SPEED": { N: String(data.SPEED || 0) },
      "BATTERY_PERCENT": { N: String(data.BATTERY_PERCENT || 0) }
    }
  };

  try {
    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);
    console.log('DynamoDB에 성공적으로 저장되었습니다:');
    console.table(params.Item);
  } catch (err) {
    console.error('DynamoDB 저장 중 오류 발생:', err);
  }
}

// DynamoDB에서 날짜 범위로 데이터 조회
async function scanDynamoDB(startDate, endDate) {
  const params = {
    TableName: '24_icc_ev_database',
    FilterExpression: "#timestamp between :start and :end",
    ExpressionAttributeNames: {
      "#timestamp": "timestamp"
    },
    ExpressionAttributeValues: {
      ":start": { S: new Date(startDate).toISOString() },
      ":end": { S: new Date(endDate).toISOString() }
    }
  };

  try {
    const command = new ScanCommand(params);
    const data = await dynamoDBClient.send(command);

    if (!data.Items || data.Items.length === 0) {
      console.log('조회된 데이터가 없습니다.');
      return [];
    }

    return data.Items.map(item => ({
      timestamp: item.timestamp?.S || 'N/A',
      RPM: item.RPM?.N || '0',
      MOTOR_CURRENT: item.MOTOR_CURRENT?.N || '0',
      BATTERY_VOLTAGE: item.BATTERY_VOLTAGE?.N || '0',
      THROTTLE_SIGNAL: item.THROTTLE_SIGNAL?.N || '0',
      CONTROLLER_TEMPERATURE: item.CONTROLLER_TEMPERATURE?.N || '0',
      SPEED: item.SPEED?.N || '0',
      BATTERY_PERCENT: item.BATTERY_PERCENT?.N || '0'
    }));
  } catch (err) {
    console.error('DynamoDB 조회 중 오류 발생:', err);
    throw err;
  }
}

// 데이터를 Excel 파일로 변환
async function generateExcel(data) {
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('ICC EV Data');

  worksheet.columns = [
    { header: 'Timestamp', key: 'timestamp', width: 25 },
    { header: 'RPM', key: 'RPM', width: 15 },
    { header: 'Motor Current', key: 'MOTOR_CURRENT', width: 20 },
    { header: 'Battery Voltage', key: 'BATTERY_VOLTAGE', width: 20 },
    { header: 'Throttle Signal', key: 'THROTTLE_SIGNAL', width: 20 },
    { header: 'Controller Temperature', key: 'CONTROLLER_TEMPERATURE', width: 30 },
    { header: 'Speed', key: 'SPEED', width: 20 },
    { header: 'Battery Percent', key: 'BATTERY_PERCENT', width: 20 }
  ];

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  return workbook;
}

// 클라이언트로부터 요청 받은 기간 동안의 데이터를 조회하고 Excel로 변환하여 전달하는 엔드포인트
app.post('/export-excel', async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const data = await scanDynamoDB(startDate, endDate);

    if (!data || data.length === 0) {
      return res.status(404).send('해당 날짜 범위에 대한 데이터가 없습니다.');
    }

    const workbook = await generateExcel(data);

    // 파일 전송
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('엑셀 파일 생성 중 오류 발생:', error);
    res.status(500).send('엑셀 파일 생성 중 오류가 발생했습니다.');
  }
});

// Socket.IO 연결 이벤트
io.on('connection', function (socket) {
  console.log(getKoreaTime(), '사용자 연결됨:', socket.id);

  // // 서버 기능 테스트용
  // setInterval(() => {
  //   let tempValue1 = Math.floor(Math.random() * 1000);
  //   let tempValue2 = Math.floor(Math.random() * 1000);
  //   const dataWithKey = {
  //     timestamp: getKoreaTime(),
  //     RPM: parseInt(tempValue1),
  //     MOTOR_CURRENT: parseInt(tempValue1),
  //     BATTERY_VOLTAGE: parseInt(tempValue2),
  //     THROTTLE_SIGNAL: parseInt(tempValue1),
  //     CONTROLLER_TEMPERATURE: parseInt(tempValue2),
  //     SPEED: parseInt(tempValue1),
  //     BATTERY_PERCENT: parseInt(tempValue2)
  //   };

  //   // 수신된 데이터를 클라이언트에 즉시 전송
  //   socket.emit('dataReceived', dataWithKey);
  // }, 1000);
    


  // 연결 테스트
  socket.on('message', function(data) {
    console.log(getKoreaTime(), '받은 메시지 : ', data);
  })
  
  // ESP32에서 데이터 수신 및 처리
  socket.on('sendData', (receivedData) => {
    try {
      console.log('sendData 실행');
      // receivedData가 28자리의 16진수 배열로 들어온다고 가정
      const buffer = Buffer.from(receivedData, 'hex'); // receivedData를 Buffer로 변환 (16진수)

      // 데이터를 파싱하여 10진수로 변환
      const parsedData = parseData(buffer);

      // 파싱된 데이터 출력
      console.log('Parsed Data:', parsedData);

      // 데이터를 저장
      saveToDynamoDB(parsedData);

      // 수신된 데이터를 클라이언트에 즉시 전송
      socket.emit('dataReceived', parsedData);

    } catch (error) {
      console.error('데이터 처리 중 오류 발생:', error);
      socket.emit('error', { message: '데이터 처리 중 오류 발생', detail: error.message });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('사용자 연결 해제됨:', reason);
  });
});

app.get('/', function (req, res) {
  // check sender ip
  var senderip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('Sender IP:', senderip);  // IP 주소 로그 출력
  res.send('<h3>24 EV Node.js 서버</h3>');  // 클라이언트에게 응답 전송
});

// 서버 시작
server.listen(port, () => {
  console.log(`${port} 포트에서 서버가 시작되었습니다.`);
  console.log(getKoreaTime());
});
