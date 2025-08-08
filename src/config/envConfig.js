require("dotenv").config();

// 환경변수
module.exports = {
  DYNAMODB_ACCESS_KEY: process.env.DYNAMODB_ACCESS_KEY,
  DYNAMODB_SECRET_ACCESS_KEY: process.env.DYNAMODB_SECRET_ACCESS_KEY,
  PORT: process.env.PORT || 2004,
  SERVER_MODE: process.env.SERVER_MODE || "development",
  CONTROLLER_VERSION: process.env.CONTROLLER_VERSION || 24,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:1101",
};

// SERVER_MODE는 production development 두가지입니다. 순서대로 배포, 개발 및 테스트용입니다.
// CONTROLLER_VERSION 은 현재 dataFormat에 맞게 24, 25만 지원합니다.
