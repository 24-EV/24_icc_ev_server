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

  // 기본 엔드포인트
  app.get('/', function (req, res) {
    // check sender ip
    var senderip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Sender IP:', senderip);  // IP 주소 로그 출력
    res.send('<h3>24 EV Node.js 서버</h3>');  // 클라이언트에게 응답 전송
  });