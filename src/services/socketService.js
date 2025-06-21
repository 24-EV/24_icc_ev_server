const { parseData, getKoreaTime } = require("../utils/Utils.js");
const { saveToDynamoDB } = require("../services/dynamoDBService.js");
const { createSocketServer } = require("../config/socketConfig.js");

// 소켓 이벤트 핸들러
function initSocket(io) {
  // Socket.IO 연결 이벤트
  io.on("connection", function (socket) {
    console.log(getKoreaTime(), "사용자 연결됨:", socket.id);

    // 서버 기능 테스트용
    setInterval(() => {
      let tempValue1 = Math.floor(Math.random() * 1000);
      let tempValue2 = Math.floor(Math.random() * 1000);
      let tempValue3 = Math.floor(Math.random() * 1000);
      const dataWithKey = {
        timestamp: getKoreaTime(),
        RPM: parseInt(tempValue2),
        MOTOR_CURRENT: parseInt(tempValue2),
        BATTERY_VOLTAGE: parseInt(tempValue1),
        THROTTLE_SIGNAL: parseInt(tempValue1),
        CONTROLLER_TEMPERATURE: parseInt(tempValue3),
        SPEED: parseInt(tempValue1),
        BATTERY_PERCENT: parseInt(tempValue3),
      };

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

module.exports = { initSocket };
