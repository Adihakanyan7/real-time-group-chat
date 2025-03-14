const { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, AdminUpdateUserAttributesCommand } = require("@aws-sdk/client-cognito-identity-provider");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const axios = require("axios");

require("dotenv").config({ path: "../.env" });


// Load environment variables
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

// Initialize AWS Cognito Client
const cognito = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Sign up a new user
async function signUp(email, password) {
    const command = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email, 
        Password: password,
        UserAttributes: [
            { Name: "email", Value: email }
        ]
    });

    return await cognito.send(command);
}



// Log in and get a JWT token
async function login(email, password) {
    const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: {
            USERNAME: email, 
            PASSWORD: password
        }
    });

    return await cognito.send(command);
}

async function verifyUserEmail(email) {
    const command = new AdminUpdateUserAttributesCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: [
            { Name: "email_verified", Value: "true" }
        ]
    })
    return await cognito.send(command);
}

// Verify JWT token using Cognito's public key
async function verifyToken(token) {
    try {
        // Decode token header to get the Key ID (kid)
        const decodedHeader = jwt.decode(token, { complete: true });
        if (!decodedHeader) {
            throw new Error("Invalid token");
        }

        const kid = decodedHeader.header.kid;
        const region = "eu-north-1"; // Replace with your AWS region
        const userPoolId = process.env.COGNITO_USER_POOL_ID;

        // Get Cognito's public keys
        const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
        const { data } = await axios.get(jwksUrl);

        // Find the matching key
        const key = data.keys.find(k => k.kid === kid);
        if (!key) {
            throw new Error("Public key not found");
        }

        // Convert JWK to PEM format
        const pem = jwkToPem(key);

        // Verify the token
        return jwt.verify(token, pem, { algorithms: ["RS256"] });
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return null;
    }
}
module.exports = { signUp, login, verifyUserEmail, verifyToken };
