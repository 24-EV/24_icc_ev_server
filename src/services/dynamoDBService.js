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

// 다이나모DB 저장 함수 관련
const saveToDynamoDBMap = {
  24: saveToDynamoDB24Controller,
  25: saveToDynamoDB25Controller,
};

async function saveToDynamoDB(data, version = CONTROLLER_VERSION) {
  const func = saveToDynamoDBMap[version];
  if (!fn) {
    throw new Error(`지원하지 않는 버전입니다. : ${version}`);
  }

  return await func();
}

// 다이나모DB 스캔 함수 관련
const scanDynamoDBMap = {
  24: scanDynamoDB24Controller,
  25: scanDynamoDB25Controller,
};

async function scanDynamoDB(startDate, endDate, version = CONTROLLER_VERSION) {
  const func = scanDynamoDBMap[version];
  if (!func) {
    throw new Error(`지원하지 않는 버전입니다. ${version}`);
  }

  return await func(startDate, endDate);
}

// DynamoDB에 데이터를 저장하는 함수
// 24년도
async function saveToDynamoDB24Controller(data) {
  const params = {
    TableName: "24_icc_ev_database",
    Item: {
      timestamp: { S: getKoreaTime() },
      // 값이 undefined일 경우 기본값 0으로 대체
      RPM: { N: String(data.RPM || 0) },
      MOTOR_CURRENT: { N: String(data.MOTOR_CURRENT || 0) },
      BATTERY_VOLTAGE: { N: String(data.BATTERY_VOLTAGE || 0) },
      THROTTLE_SIGNAL: { N: String(data.THROTTLE_SIGNAL || 0) },
      CONTROLLER_TEMPERATURE: { N: String(data.CONTROLLER_TEMPERATURE || 0) },
      SPEED: { N: String(data.SPEED || 0) },
      BATTERY_PERCENT: { N: String(data.BATTERY_PERCENT || 0) },
    },
  };

  try {
    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);
    logger("DynamoDB에 성공적으로 저장되었습니다:", params.Item);
  } catch (err) {
    logger("DynamoDB 저장 중 오류 발생:", err);
    throw err; // 에러 미들웨어로 위임
  }
}

// 25년도
async function saveToDynamoDB25Controller(data) {
  const params = {
    TableName: "24_icc_ev_database",
    Item: {
      timestamp: { S: getKoreaTime() },
      // 값이 undefined일 경우 기본값 0으로 대체
      RPM: { N: String(data.RPM || 0) },
      MOTOR_CURRENT: { N: String(data.MOTOR_CURRENT || 0) },
      BATTERY_VOLTAGE: { N: String(data.BATTERY_VOLTAGE || 0) },
      THROTTLE_SIGNAL: { N: String(data.THROTTLE_SIGNAL || 0) },
      CONTROLLER_TEMPERATURE: { N: String(data.CONTROLLER_TEMPERATURE || 0) },
      SPEED: { N: String(data.SPEED || 0) },
      BATTERY_PERCENT: { N: String(data.BATTERY_PERCENT || 0) },
    },
  };

  try {
    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);
    logger("DynamoDB에 성공적으로 저장되었습니다:", params.Item);
  } catch (err) {
    logger("DynamoDB 저장 중 오류 발생:", err);
    throw err; // 에러 미들웨어로 위임
  }
}

// DynamoDB에서 날짜 범위로 데이터 조회
// 24년도
async function scanDynamoDB24Controller(startDate, endDate) {
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

    return data.Items.map((item) => ({
      timestamp: item.timestamp?.S || "N/A",
      RPM: item.RPM?.N || "0",
      MOTOR_CURRENT: item.MOTOR_CURRENT?.N || "0",
      BATTERY_VOLTAGE: item.BATTERY_VOLTAGE?.N || "0",
      THROTTLE_SIGNAL: item.THROTTLE_SIGNAL?.N || "0",
      CONTROLLER_TEMPERATURE: item.CONTROLLER_TEMPERATURE?.N || "0",
      SPEED: item.SPEED?.N || "0",
      BATTERY_PERCENT: item.BATTERY_PERCENT?.N || "0",
    }));
  } catch (err) {
    logger("DynamoDB 조회 중 오류 발생:", err);
    throw err; // 에러 미들웨어로 위임
  }
}

// 25년도
async function scanDynamoDB25Controller(startDate, endDate) {
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

    return data.Items.map((item) => ({
      timestamp: item.timestamp?.S || "N/A",
      RPM: item.RPM?.N || "0",
      MOTOR_CURRENT: item.MOTOR_CURRENT?.N || "0",
      BATTERY_VOLTAGE: item.BATTERY_VOLTAGE?.N || "0",
      THROTTLE_SIGNAL: item.THROTTLE_SIGNAL?.N || "0",
      CONTROLLER_TEMPERATURE: item.CONTROLLER_TEMPERATURE?.N || "0",
      SPEED: item.SPEED?.N || "0",
      BATTERY_PERCENT: item.BATTERY_PERCENT?.N || "0",
    }));
  } catch (err) {
    logger("DynamoDB 조회 중 오류 발생:", err);
    throw err; // 에러 미들웨어로 위임
  }
}

module.exports = { saveToDynamoDB, scanDynamoDB };
