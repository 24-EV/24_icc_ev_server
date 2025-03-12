// AWS SDK 설정. IAM 역할 할당이 불가능한 환경에서 사용.
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const envConfig = require('./envConfig');

// AWS DynamoDB Config 객체. IAM 역할 할당한 코드는 role, 안 한 건 key로
const dbClient = {
    role: new DynamoDBClient({
        region: 'ap-northeast-2'
    }),
    key: new DynamoDBClient({
        region: 'ap-northeast-2',
        credentials: {
            accessKeyId: envConfig.DYNAMODB_ACCESS_KEY,
            secretAccessKey: envConfig.DYNAMODB_SECRET_ACCESS_KEY
        }
    }),
};

function getDynamoDBClient(mode = 'key') {
    return dbClient[mode];
}

module.exports = { getDynamoDBClient }