const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const XLSX = require('xlsx');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,  // ping 타임아웃을 늘림 (기본값은 60000ms = 60초)
  pingInterval: 25000,  // ping 간격을 늘림 (기본값은 25000ms = 25초)
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    // transports: ['websocket']
  }
});

const port = 2004;  // 서버 포트

// 파일 경로 설정
const totalPath = path.join(__dirname, 'data', 'total.json');
const recentPath = path.join(__dirname, 'data', 'recent.json');
const excelFilePath = path.join(__dirname, 'data', 'log.xlsx');

app.use(cors());
app.use(express.json());

let startTimestamp = null;  // Excel 로깅 시작 시간 저장 변수

// JSON 파일에 새 데이터를 추가하는 함수
function updateJsonFile(filePath, newData) {
  fs.readFile(filePath, 'utf8', (err, fileData) => {
    let jsonData = [];
    if (!err && fileData) {
      try {
        jsonData = JSON.parse(fileData);
      } catch {
        jsonData = [];
      }
    }
    jsonData.push(newData);
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file to disk: ${err}`);
      }
    });
  });
}

// 최신 데이터를 recent.json에 저장하는 함수
function updateJsonFileRecent(filePath, newData) {
  fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file to disk: ${err}`);
    }
  });
}

// 데이터 평탄화 함수
function flattenData(data) {
  return data.map(entry => ({
    timestamp: entry.timestamp,
    ...entry.data[0]
  }));
}

// Excel 파일 처리 함수
function processExcelFile(socket) {
  try {
    if (!fs.existsSync(totalPath)) {
      throw new Error('total.json 파일이 존재하지 않습니다.');
    }
    const fileContent = fs.readFileSync(totalPath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    const flatData = flattenData(jsonData);
    const filteredData = flatData.filter(item => new Date(item.timestamp) >= new Date(startTimestamp));

    let workbook = fs.existsSync(excelFilePath) ? XLSX.readFile(excelFilePath) : XLSX.utils.book_new();
    
    const sheetName = new Date().toISOString().replace(/[:.-]/g, '_');
    const sheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    XLSX.writeFile(workbook, excelFilePath);

    socket.emit('excelStopped', { message: 'Excel 파일이 성공적으로 저장되었습니다.' });
  } catch (error) {
    console.error('Excel 파일 처리 중 오류 발생:', error);
    socket.emit('error', { message: `Excel 파일 처리 중 오류 발생: ${error.message}` });
  }
}

// Socket.IO 연결 이벤트
io.on('connection', (socket) => {
  console.log('사용자 연결됨:', socket.id);  // 연결된 소켓의 ID 출력

  // 클라이언트에서 발생한 에러를 처리하는 구문 추가
  socket.on('error', (err) => {
    console.error('Socket.IO Error:', err);
    socket.emit('error', { message: '서버에서 오류가 발생했습니다.', detail: err.message });
  });
  
  socket.on('disconnect', (reason) => {
    console.log('사용자 연결 해제됨:', reason);
  });

  // 데이터 요청
  socket.on('requestData', () => {
    fs.readFile(recentPath, 'utf8', (err, fileData) => {
      if (err || !fileData || fileData.trim() === "") {
        console.error('recent.json 파일을 읽는 중 오류 발생 또는 파일이 비어 있습니다.');
        socket.emit('error', { message: '최근 데이터를 읽는 중 오류 발생' });
        return;
      }

      try {
        const recentData = JSON.parse(fileData);
        socket.emit('dataReceived', { data: [recentData] });
      } catch (error) {
        console.error('최근 데이터 파싱 중 오류 발생:', error);
        socket.emit('error', { message: '최근 데이터 파싱 중 오류 발생' });
      }
    });
  });

  // 데이터 수신 및 저장
  socket.on('sendData', (receivedData) => {
    try {
      const dataWithKey = {
        timestamp: new Date().toISOString(),
        data: receivedData.data
      };

      updateJsonFile(totalPath, dataWithKey);
      updateJsonFileRecent(recentPath, dataWithKey);

      socket.emit('dataReceived', { data: [dataWithKey] });
    } catch (error) {
      console.error('데이터 처리 중 오류 발생:', error);
      socket.emit('error', { message: '데이터 처리 중 오류 발생', detail: error.message });
    }
  });

  // Excel 로깅 시작
  socket.on('startExcel', () => {
    try {
      startTimestamp = new Date().toISOString();
      socket.emit('excelStarted', { message: 'Excel 로깅 시작', startTimestamp });
    } catch (error) {
      console.error('Excel 로깅 시작 중 오류 발생:', error);
      socket.emit('error', { message: 'Excel 로깅 시작 중 오류 발생', detail: error.message });
    }
  });

  // Excel 로깅 중지 및 파일 저장
  socket.on('stopExcel', () => {
    processExcelFile(socket);
  });

  // 연결 해제
});

// 서버 시작
server.listen(port, () => {
  console.log(`${port} 포트에서 서버가 시작되었습니다.`);
});
