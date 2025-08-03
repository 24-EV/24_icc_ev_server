const DataFormat = require("../utils/DataFormat.js");

const { ScanCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { getDynamoDBClient } = require("../config/dynamoDBConfig.js");
const { getKoreaTime } = require("../utils/Utils.js");

const dynamoDBClient = getDynamoDBClient("key"); // IAM 역할 할당 시 'key' -> 'role' 로 변경
const CONTROLLER_VERSION = process.env.CONTROLLER_VERSION || 24;

// 간단한 로깅 함수 (실제 운영에서는 winston 등 사용 권장)
function logger(message, data) {
  if (process.env.NODE_ENV !== "test") {
    console.log(`[${new Date().toISOString()}]`, message, data || "");
  }
}

async function saveToDynamoDB(data, version = CONTROLLER_VERSION) {
  if (!DataFormat[version]) {
    throw new Error(`지원하지 않는 버전입니다. : ${version}`);
  }

  const params = {
    TableName: "24_icc_ev_database",
    Item: {
      timestamp: { S: getKoreaTime() },
      ...DataFormat[version],
    },
  };

  Object.keys(params.Item).forEach((key) => {
    if (key === "timestamp") {
      return;
    }

    params.Item[key] = { N: String(data[key] || 0) };
  });

  try {
    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);
    logger("DynamoDB에 성공적으로 저장되었습니다:", params.Item);
  } catch (err) {
    logger("DynamoDB 저장 중 오류 발생:", err);
    throw err; // 에러 미들웨어로 위임
  }
}

async function scanDynamoDB(startDate, endDate, version = CONTROLLER_VERSION) {
  if (!DataFormat[version]) {
    throw new Error(`지원하지 않는 버전입니다. : ${version}`);
  }

  const params = {
    TableName: "24_icc_ev_database",
    FilterExpression: "#timestamp between :start and :end",
    ExpressionAttributeNames: {
      "#timestamp": "timestamp",
    },
    ExpressionAttributeValues: {
      ":start": { S: new Date(startDate).toISOString() },
      ":end": { S: new Date(endDate).toISOString() },
    },
  };

  try {
    const command = new ScanCommand(params);
    const data = await dynamoDBClient.send(command);

    if (!data.Items || data.Items.length === 0) {
      logger("조회된 데이터가 없습니다.");
      return [];
    }

    return data.Items.map((item) => {
      const data = {
        timestamp: item.timestamp?.S || "N/A",
        ...DataFormat[version],
      };

      Object.keys(data).forEach((key) => {
        if (key === "timestamp") {
          return;
        }

        data[key] = item[key].N || "0";
      });

      return data;
    });
  } catch (err) {
    logger("DynamoDB 조회 중 오류 발생:", err);
    throw err; // 에러 미들웨어로 위임
  }
}

module.exports = { saveToDynamoDB, scanDynamoDB };
