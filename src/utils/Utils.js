const exceljs = require('exceljs');

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

// 현재 한국 시간 리턴
function getKoreaTime() {
    const koreaTime = new Date(Date.now() + (9 * 60 * 60 * 1000)); // UTC + 9시간
    return koreaTime.toISOString().replace('T', ' ').split('.')[0];
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

module.exports = {parseData, getKoreaTime, generateExcel };