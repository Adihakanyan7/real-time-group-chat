const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();
require("dotenv").config({ path: "../.env" });  // Ensure it loads the correct .env file

// Initialize DynamoDB Client
const dynamoDB = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Use DocumentClient for easier JSON interactions
const docClient = DynamoDBDocumentClient.from(dynamoDB);

module.exports = { dynamoDB, docClient };
