import DataFormat from "../utils/DataFormat.js";

const { parseData, getKoreaTime } = require("../utils/Utils.js");
const { saveToDynamoDB } = require("../services/dynamoDBService.js");
const { createSocketServer } = require("../config/socketConfig.js");

const CONTROLLER_VERSION = process.env.CONTROLLER_VERSION || 24;

// 소켓 이벤트 핸들러
function initSocket(io) {
  // Socket.IO 연결 이벤트
  io.on("connection", function (socket) {
    console.log(getKoreaTime(), "사용자 연결됨:", socket.id);

    // 서버 기능 테스트용
    setInterval(() => {
      dataWithKey = socketTester();

      // 수신된 데이터를 클라이언트에 즉시 전송
      socket.emit("dataReceived", dataWithKey);
    }, 1000);

    // 연결 테스트
    socket.on("message", function (data) {
      console.log(getKoreaTime(), "받은 메시지 : ", data);
    });

    // ESP32에서 데이터 수신 및 처리
    socket.on("sendData", (receivedData) => {
      try {
        console.log("sendData 실행");
        // receivedData가 28자리의 16진수 배열로 들어온다고 가정
        // 이것도 이제 컨트롤러 버전마다 다름. 24년도 - 28자리, 28년도
        const buffer = Buffer.from(receivedData, "hex"); // receivedData를 Buffer로 변환 (16진수)

        // 데이터를 파싱하여 10진수로 변환
        const parsedData = parseData(buffer);

        // 파싱된 데이터 출력
        console.log("Parsed Data:", parsedData);

        // 데이터를 저장
        saveToDynamoDB(parsedData);

        // 수신된 데이터를 클라이언트에 즉시 전송
        socket.emit("dataReceived", parsedData);
      } catch (error) {
        console.error("데이터 처리 중 오류 발생:", error);
        socket.emit("error", {
          message: "데이터 처리 중 오류 발생",
          detail: error.message,
        });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("사용자 연결 해제됨:", reason);
    });
  });
}

// 연결 테스트 함수. 서버에서 랜덤값을 만들어 보냄.
function socketTester(version = CONTROLLER_VERSION) {
  if (!DataFormat[version]) {
    throw new Error(`지원하지 않는 버전입니다. : ${version}`);
  }

  const tempValue = {
    0: Math.floor(Math.random() * 1000),
    1: Math.floor(Math.random() * 1000),
    2: Math.floor(Math.random() * 1000),
    3: Math.floor(Math.random() * 1000),
    4: Math.floor(Math.random() * 1000),
  };

  const dataWithKey = { timestamp: getKoreaTime(), ...DataFormat };

  Object.keys(dataWithKey).forEach((key) => {
    if (key === "timestamp") {
      return;
    }

    dataWithKey[key] = parseInt(tempValue[Math.floor(Math.random() * 5)]);
  });

  return dataWithKey;
}

module.exports = { initSocket };
