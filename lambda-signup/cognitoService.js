import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "./db.js";
import User from "./User.js";

const USERS_TABLE = "UsersTable";
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export const registerUser = async (email, password, username) => {
  const params = {
    ClientId: process.env.COGNITO_APP_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [{ Name: "email", Value: email }],
  };

  try {
    const cognitoResponse = await cognitoClient.send(new SignUpCommand(params));
    const userId = cognitoResponse.UserSub;

    const newUser = User(userId, email, username);

    await docClient.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: newUser,
    }));

    return { message: "User registered successfully! Please confirm your email." };

  } catch (error) {
    if (error.name === "UsernameExistsException") {
      return { error: "User already exists. Please log in instead." };
    }

    console.error("❌ Error registering user:", error);
    throw error;
  }
};
