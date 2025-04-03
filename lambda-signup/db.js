import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

export const docClient = DynamoDBDocumentClient.from(dbClient);
