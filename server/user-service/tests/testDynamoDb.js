const { DynamoDBClient, CreateTableCommand, ListTablesCommand  } = require("@aws-sdk/client-dynamodb");
require("dotenv").config({ path: "../.env" });

// Initialize DynamoDB Client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

// Function to list all tables
async function listTables() {
    try {
      const command = new ListTablesCommand({});
      const response = await client.send(command);
      console.log(`✅ Connected to DynamoDB! Tables:`, response.TableNames);
    } catch (error) {
      console.error("❌ Error listing tables:", error.message);
    }
  }

  listTables();




  
// // Function to create a table
// async function createTable(tableName, partitionKey) {
//   const command = new CreateTableCommand({
//     TableName: tableName,
//     KeySchema: [{ AttributeName: partitionKey, KeyType: "HASH" }],
//     AttributeDefinitions: [{ AttributeName: partitionKey, AttributeType: "S" }],
//     BillingMode: "PAY_PER_REQUEST", // On-demand pricing
//   });

//   try { 
//     const response = await client.send(command);
//     console.log(`✅ Table "${tableName}" created successfully!`);
//   } catch (error) {
//     console.error(`❌ Error creating table "${tableName}":`, error.message);
//   }
// }

// Create the tables
// (async () => {
//   await createTable("UsersTable", "userId");
//   await createTable("RoomsTable", "roomId");
// })();
