const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" }); // Change region if needed
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Rooms";

const saveRoom = async (room) => {
    const params = {
        TableName: TABLE_NAME,
        Item: room,
    };

    await dynamoDB.put(params).promise();
};

module.exports = { saveRoom };
