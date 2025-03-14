require("dotenv").config({ path: "../.env" });
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: process.env.AWS_REGION });

// Define the user details
const params = {
  TableName: "UsersTable",
  Item: {
    userId: { S: "12345" }, // Unique user ID
    email: { S: "testuser@example.com" }, // Email
    username: { S: "TestUser" }, // Username
    createdAt: { S: new Date().toISOString() }, // Timestamp
  },
};

// Function to insert user
const insertUser = async () => {
  try {
    await client.send(new PutItemCommand(params));
    console.log("✅ Test user inserted successfully!");
  } catch (error) {
    console.error("❌ Error inserting user:", error);
  }
};

// Run the function
insertUser();
