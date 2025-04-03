const { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand  } = require("@aws-sdk/client-cognito-identity-provider");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../db");
const User = require("../models/User");
require("dotenv").config();

const USERS_TABLE = "UsersTable";
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

// Register a new user in Cognito and save user data in DynamoDB
const registerUser = async (email, password, username) => {
    const params = {
        ClientId: process.env.COGNITO_APP_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }]
    };

    try {
        const cognitoResponse = await cognitoClient.send(new SignUpCommand(params));
        const cognitoUserId = cognitoResponse.UserSub; // Get Cognito user ID (sub)

        const newUser = User(cognitoUserId, email, username);
        const dbParams = new PutCommand({
            TableName: USERS_TABLE,
            Item: newUser
        });

        await docClient.send(dbParams);
        
        return { message: "User registered successfully! Please confirm your email." };

    } catch (error) {
        if (error.name === "UsernameExistsException") {
            return { error: "User already exists. Please log in instead." };
        }

        console.error("❌ Error registering user:", error);
        throw error; // Rethrow for other errors
    }
};

//  Authenticate a user and get JWT tokens
const loginUser = async (email, password) => {
    const params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_APP_CLIENT_ID,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    };

    try {
        const response = await cognitoClient.send(new InitiateAuthCommand(params));
        return {
            accessToken: response.AuthenticationResult.AccessToken,
            idToken: response.AuthenticationResult.IdToken,
            refreshToken: response.AuthenticationResult.RefreshToken
        };
    } catch (error) {
        console.error("❌ Error logging in user:", error);
        throw error;
    }
};

const confirmUser = async (email, code) => {
    const params = {
        ClientId: process.env.COGNITO_APP_CLIENT_ID,
        Username: email,
        ConfirmationCode: code
    };

    try {
        await cognitoClient.send(new ConfirmSignUpCommand(params));
        return { message: "User confirmed successfully! You can now log in." };
    } catch (error) {
        console.error("❌ Error confirming user:", error);
        throw error;
    }
};

module.exports = { registerUser, loginUser, confirmUser };
