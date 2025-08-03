const parsedDataMap = require("./DataFormat");

const CONTROLLER_VERSION = process.env.CONTROLLER_VERSION || 24;

// 현재 한국 시간 리턴
function getKoreaTime() {
  const koreaTime = new Date(Date.now() + 9 * 60 * 60 * 1000); // UTC + 9시간
  return koreaTime.toISOString().replace("T", " ").split(".")[0];
}

function parseData(buffer, version = CONTROLLER_VERSION) {
  if (!parsedDataMap[version]) {
    throw new Error(`지원하지 않는 버전입니다. : ${version}`);
  }

  const CORRECT_BUFFER_LENGTH = Object.keys(parsedDataMap[version]).length * 2;
  if (!buffer) {
    throw new Error("buffer가 들어있지 않거나 ");
  } else if (buffer.length < CORRECT_BUFFER_LENGTH) {
    throw new Error(
      `buffer 길이가 짧음. 비정상적인 데이터 : ${CORRECT_BUFFER_LENGTH}`
    );
  }

  const parsedData = { ...parsedDataMap[version] };

  Object.keys(parsedData).forEach((key, idx) => {
    parsedData[key] = parseInt(
      buffer
        .slice(idx * 2, idx * 2 + 2)
        .reverse()
        .toString("hex"),
      16
    );
  });

  return parsedData;
}

async function generateExcel(data, version = CONTROLLER_VERSION) {
  if (!parsedDataMap[version]) {
    throw new Error(`지원하지 않는 버전입니다. : ${version}`);
  }

  if (!data || data.length === 0) {
    throw new Error(`data가 들어있지 않음 : ${data}`);
  }

  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet("ICC EV Data");

  Object.keys(parsedDataMap).forEach((item) => {
    worksheet.columns.push({ header: item, key: item, width: 20 });
  });

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  return workbook;
}

module.exports = { parseData, getKoreaTime, generateExcel };
