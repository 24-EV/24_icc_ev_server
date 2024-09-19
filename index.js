const express = require('express');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,  // ping 타임아웃 설정 (60초)
  pingInterval: 25000,  // ping 간격 설정 (25초)
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

const port = 2004;  // 서버 포트

// AWS SDK 설정 (여기에 자격 증명을 추가합니다)
const dynamoDBClient = new DynamoDBClient({
  region: 'ap-northeast-2',  // 지역 설정
  credentials: {
    accessKeyId: 'AKIAU6GD355IVGMNNTNG',  // 여기에 AWS 액세스 키 입력
    secretAccessKey: 'AOiJFTGHugsnLMnB/waIwvP6/Q1K9t79h2mSF5YT'  // 여기에 AWS 비밀 키 입력
  }
});

app.use(cors());
app.use(express.json());

// DynamoDB에 데이터를 저장하는 함수
async function saveToDynamoDB(data) {
  const params = {
    TableName: '24_icc_ev_database',  // DynamoDB 테이블 이름
    Item: {
      "timestamp": { S: new Date().toISOString() },
      "RPM": { N: String(data.RPM) },
      "MOTOR_CURRENT": { N: String(data.MOTOR_CURRENT) },
      "BATTERY_VOLTAGE": { N: String(data.BATTERY_VOLTAGE) },
      "THROTTLE_SIGNAL": { N: String(data.THROTTLE_SIGNAL) },
      "CONTROLLER_TEMPERATURE": { N: String(data.CONTROLLER_TEMPERATURE) },
      "RTC": { N: String(data.RTC) },
      "PCB_TEMP": { N: String(data.PCB_TEMP) }
    }
  };

  try {
    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);
    console.log('DynamoDB에 성공적으로 저장되었습니다:', data);
  } catch (err) {
    console.error('DynamoDB 저장 중 오류 발생:', err);
  }
}

// Excel 로깅을 처리하는 함수
function processExcelFile(socket) {
  // Excel 파일 처리 로직을 여기에 추가하세요.
  // 예를 들어, 데이터를 CSV 파일로 저장하거나, 엑셀 라이브러리를 사용하여 엑셀 파일을 생성하는 등의 작업을 수행할 수 있습니다.

  socket.emit('excelProcessed', { message: 'Excel 파일이 처리되었습니다.' });
}

// Socket.IO 연결 이벤트
io.on('connection', (socket) => {
  console.log('사용자 연결됨:', socket.id);

  const dataWithKey = {
    RPM: 2004,
    MOTOR_CURRENT: 2004,
    BATTERY_VOLTAGE: 2004,
    THROTTLE_SIGNAL: 2004,
    CONTROLLER_TEMPERATURE: 2004,
    RTC: 2004,
    PCB_TEMP: 2004
  };
  
  saveToDynamoDB(dataWithKey);
  
  socket.on('error', (err) => {
    console.error('Socket.IO Error:', err);
    socket.emit('error', { message: '서버에서 오류가 발생했습니다.', detail: err.message });
  });

  socket.on('disconnect', (reason) => {
    console.log('사용자 연결 해제됨:', reason);
  });
  
  // 1. 수신된 데이터를 클라이언트에 즉시 전송
  socket.emit('dataReceived', dataWithKey);
  
  // ESP32에서 데이터 수신 및 처리
  socket.on('sendData', (receivedData) => {
    try {
      const dataWithKey = {
        RPM: receivedData.RPM,
        MOTOR_CURRENT: receivedData.MOTOR_CURRENT,
        BATTERY_VOLTAGE: receivedData.BATTERY_VOLTAGE,
        THROTTLE_SIGNAL: receivedData.THROTTLE_SIGNAL,
        CONTROLLER_TEMPERATURE: receivedData.CONTROLLER_TEMPERATURE,
        RTC: receivedData.RTC,
        PCB_TEMP: receivedData.PCB_TEMP
      };

      // 1. 수신된 데이터를 클라이언트에 즉시 전송
      socket.emit('dataReceived', dataWithKey);
      
      // 2. 동시에 데이터를 DynamoDB에 저장
      saveToDynamoDB(dataWithKey);

    } catch (error) {
      console.error('데이터 처리 중 오류 발생:', error);
      socket.emit('error', { message: '데이터 처리 중 오류 발생', detail: error.message });
    }
  });

  // Excel 로깅 시작
  socket.on('startExcel', () => {
    try {
      const startTimestamp = new Date().toISOString();
      socket.emit('excelStarted', { message: 'Excel 로깅 시작', startTimestamp });
    } catch (error) {
      console.error('Excel 로깅 시작 중 오류 발생:', error);
      socket.emit('error', { message: 'Excel 로깅 시작 중 오류 발생', detail: error.message });
    }
  });

  // Excel 로깅 중지 및 파일 저장
  socket.on('stopExcel', () => {
    try {
      processExcelFile(socket);  // Excel 파일 처리 함수 호출
    } catch (error) {
      console.error('Excel 처리 중 오류 발생:', error);
      socket.emit('error', { message: 'Excel 처리 중 오류 발생', detail: error.message });
    }
  });
});

// 서버 시작
server.listen(port, () => {
  console.log(`${port} 포트에서 서버가 시작되었습니다.`);
});
