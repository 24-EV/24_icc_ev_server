require('dotenv').config();

// 환경변수
module.exports = {
    DYNAMODB_SECRET_ACCESS_KEY : process.env.DYNAMODB_ACCESS_KEY,
    DYNAMODB_SECRET_ACCESS_KEY : process.env.DYNAMODB_SECRET_ACCESS_KEY,
    PORT : process.env.PORT || 2004,
} 