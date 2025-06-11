const ip = require('ip');
const express = require('express');
const cors = require('cors');
const http = require('http');

const { parseData, getKoreaTime } = require('./src/utils/Utils.js');
const { saveToDynamoDB, scanDynamoDB } = require('./src/services/dynamoDBService.js')
const { PORT } = require('./src/config/envConfig.js');
const { createSocketServer } = require('./src/config/socketConfig.js');
const { initSocket } = require('./src/services/socketService.js');
const { initRouter } = require('./src/routes/apiRoutes.js');

// express 서버 생성
const app = express();
const server = http.createServer(app);

// cors 및 json 파싱 미들웨어 추가
app.use(cors());
app.use(express.json());

// socket.io 서버 생성 및 소켓, REST API 이벤트 핸들러 설정
const io = createSocketServer(server);
initSocket(io);
initRouter(app);

// 서버 시작
// '0.0.0.0' 으로 바인딩 해야 로컬 말고 다른 데서도 된다고 함.
// server.listen(PORT, '192.168.45.169', () => {
//   console.log(`${PORT} 포트에서 서버가 시작되었습니다.`);
//   console.log(getKoreaTime());
// });

server.listen(PORT, () => {
  console.log(`${PORT} 포트에서 서버가 시작되었습니다.`);
  console.log(getKoreaTime());
});
