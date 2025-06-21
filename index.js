const ip = require("ip");
const express = require("express");
const cors = require("cors");
const http = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const winston = require("winston");

const { parseData, getKoreaTime } = require("./src/utils/Utils.js");
const {
  saveToDynamoDB,
  scanDynamoDB,
} = require("./src/services/dynamoDBService.js");
const { PORT } = require("./src/config/envConfig.js");
const { createSocketServer } = require("./src/config/socketConfig.js");
const { initSocket } = require("./src/services/socketService.js");
const { initRouter } = require("./src/routes/apiRoutes.js");

// 환경별 설정 분리 (예시: NODE_ENV)
const ENV = process.env.NODE_ENV || "development";
console.log(`현재 환경: ${ENV}`);

// express 서버 생성
const app = express();
const server = http.createServer(app);

// cors 및 json 파싱 미들웨어 추가
app.use(
  cors({
    origin: [
      "http://localhost:1101",
      "http://localhost:2004",
      "https://your-vercel-domain.vercel.app",
    ],
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// socket.io 서버 생성 및 소켓, REST API 이벤트 핸들러 설정
const io = createSocketServer(server);
initSocket(io);
initRouter(app);

// Swagger 문서화 설정
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "24 ICC EV API",
      version: "1.0.0",
      description: "24 ICC EV 서버 API 문서",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: [path.join(__dirname, "./src/routes/*.js")], // JSDoc 주석 기반
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// winston 로거 설정 (파일+콘솔)
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: "server.log" }),
    new winston.transports.Console(),
  ],
});

// Rate Limiting: 1분에 100번까지만 허용
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "요청이 너무 많습니다. 잠시 후 다시 시도하세요.",
});
app.use(limiter);

// 서버 시작
// '0.0.0.0' 으로 바인딩 해야 로컬 말고 다른 데서도 된다고 함.
// server.listen(PORT, '192.168.45.169', () => {
//   console.log(`${PORT} 포트에서 서버가 시작되었습니다.`);
//   console.log(getKoreaTime());
// });

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    logger.info(`${PORT} 포트에서 서버가 시작되었습니다.`);
    logger.info(getKoreaTime());
  });
}

// 에러 핸들링 미들웨어 (항상 라우터 뒤에 위치)
app.use((err, req, res, next) => {
  logger.error("에러 발생: " + err.stack);
  res.status(err.status || 500).json({
    message: err.message || "서버 내부 오류",
    error: ENV === "development" ? err : {},
  });
});

module.exports = app;
