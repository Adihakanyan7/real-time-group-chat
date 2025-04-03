const { PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../db");


// Table Name
const USERS_TABLE = "UsersTable";

// Get a User by ID
async function getUserById(userId) {
    const params = new GetCommand({
        TableName: USERS_TABLE,
        Key: { userId }
    });

    const { Item } = await docClient.send(params);
    return Item;
}

// Update a User
async function updateUser(userId, updates) {
    let updateExpression = "set";
    let expressionAttributeValues = {};

    if (updates.username) {
        updateExpression += " username = :username,";
        expressionAttributeValues[":username"] = updates.username;
    }

    if (updates.email) {
        updateExpression += " email = :email,";
        expressionAttributeValues[":email"] = updates.email;
    }

    // Remove trailing comma
    updateExpression = updateExpression.replace(/,$/, "");

    const params = new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { userId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW"
    });

    const { Attributes } = await docClient.send(params);
    return Attributes;
}

// Delete a User
async function deleteUser(userId) {
    const params = new DeleteCommand({
        TableName: USERS_TABLE,
        Key: { userId }
    });

    await docClient.send(params);
    return { message: "User deleted successfully" };
}

module.exports = { getUserById, updateUser, deleteUser };
