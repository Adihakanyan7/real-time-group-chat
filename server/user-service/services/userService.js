const { PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../db");
const User = require("../models/User");

// Table Name
const USERS_TABLE = "UsersTable";

// Create a New User
async function createUser(email, username) {
    const user = User(email, username); // Use our schema
    const params = new PutCommand({
        TableName: USERS_TABLE,
        Item: user
    });

    await docClient.send(params);
    return user;
}

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
    const params = new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { userId },
        UpdateExpression: "set email = :email, username = :username",
        ExpressionAttributeValues: {
            ":email": updates.email,
            ":username": updates.username
        },
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

module.exports = { createUser, getUserById, updateUser, deleteUser };
