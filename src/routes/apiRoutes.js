const express = require("express");
const router = express.Router();
const { scanDynamoDB } = require("../services/dynamoDBService.js");
const { generateExcel } = require("../utils/utils.js");

function initRouter(app) {
  app.use("/api", router);

  /**
   * @swagger
   * /api/export-excel:
   *   post:
   *     summary: 기간 내 데이터 엑셀 다운로드
   *     description: 시작일~종료일 데이터 엑셀 파일로 반환
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               startDate:
   *                 type: string
   *                 example: '2024-01-01'
   *               endDate:
   *                 type: string
   *                 example: '2024-01-31'
   *     responses:
   *       200:
   *         description: 엑셀 파일 반환
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       404:
   *         description: 데이터 없음
   *       500:
   *         description: 서버 오류
   */
  router.post("/export-excel", async (req, res, next) => {
    const { startDate, endDate } = req.body;

    try {
      const data = await scanDynamoDB(startDate, endDate);

      if (!data || data.length === 0) {
        return res.status(404).send("해당 날짜 범위에 대한 데이터가 없습니다.");
      }

      const workbook = await generateExcel(data);

      // 파일 전송
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", 'attachment; filename="data.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      // 에러 미들웨어로 전달
      next(error);
    }
  });

  /**
   * @swagger
   * /api/:
   *   get:
   *     summary: 서버 상태 확인
   *     responses:
   *       200:
   *         description: 서버 상태 메시지 반환
   */
  router.get("/", function (req, res) {
    // check sender ip
    var senderip =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("Sender IP:", senderip); // IP 주소 로그 출력
    res.send("<h3>24 EV Node.js 서버</h3>"); // 클라이언트에게 응답 전송
  });
}

module.exports = { initRouter };
