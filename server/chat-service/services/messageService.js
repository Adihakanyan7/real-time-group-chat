const { docClient } = require("../db");
const { PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "MessagesTable";

// Save a new message
async function saveMessage(message) {
    const params = {
        TableName: TABLE_NAME,
        Item: message,
    };
    try {
        console.log("💾 Saving message to DynamoDB:", params);
        await docClient.send(new PutCommand(params));
        console.log("✅ Message saved successfully!");
        return message;
    } catch (error) {
        console.error("❌ Error saving message:", error);
        throw error;
    }
}

// Get messages by roomId
async function getMessagesByRoomId(roomId) {
    const params = {
        TableName: TABLE_NAME,
        IndexName: "RoomIndex",
        KeyConditionExpression: "roomId = :roomId",
        ExpressionAttributeValues: {
            ":roomId": roomId,
        },
    };
    try {
        console.log(`🔍 Fetching messages for room ID: ${roomId}`);
        const data = await docClient.send(new QueryCommand(params));
        return data.Items || [];
    } catch (error) {
        console.error("❌ Error fetching messages:", error);
        throw error;
    }
}

// Update a message (edit text)
async function updateMessage(messageId, newText) {
    const params = {
        TableName: TABLE_NAME,
        Key: { messageId },
        UpdateExpression: "set #text = :text, #edited = :edited",
        ExpressionAttributeNames: {
            "#text": "text",
            "#edited": "edited",
        },
        ExpressionAttributeValues: {
            ":text": newText,
            ":edited": true,
        },
        ReturnValues: "ALL_NEW",
    };
    try {
        console.log(`✏️ Updating message ID: ${messageId}`);
        const { Attributes } = await docClient.send(new UpdateCommand(params));
        return Attributes;
    } catch (error) {
        console.error("❌ Error updating message:", error);
        throw error;
    }
}

// Delete a message
async function deleteMessageById(messageId) {
    const params = {
        TableName: TABLE_NAME,
        Key: { messageId },
    };
    try {
        console.log(`🗑️ Deleting message ID: ${messageId}`);
        await docClient.send(new DeleteCommand(params));
        console.log("✅ Message deleted successfully!");
        return { message: "Message deleted successfully" };
    } catch (error) {
        console.error("❌ Error deleting message:", error);
        throw error;
    }
}

module.exports = { saveMessage, getMessagesByRoomId, updateMessage, deleteMessageById };
