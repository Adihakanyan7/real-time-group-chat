const jwt = require("jsonwebtoken");
const axios = require("axios");
const jwkToPem = require("jwk-to-pem");
require("dotenv").config();

let cachedKeys = null; // Cache Cognito public keys for performance

const getCognitoPublicKeys = async () => {
    if (cachedKeys) return cachedKeys; // Return cached keys if available

    const url = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
    console.log("Fetching Cognito Public Keys from:", url); // Debugging step

    try {
        const response = await axios.get(url);
        cachedKeys = response.data.keys; // Cache keys
        console.log("Cognito Public Keys:", cachedKeys); // Debugging step
        return cachedKeys;
    } catch (error) {
        console.error("❌ Error fetching Cognito public keys:", error);
        throw new Error("Failed to fetch Cognito public keys.");
    }
};

// Middleware to verify JWT tokens
const verifyToken = async (req, res, next) => {
    

    const token = req.headers.authorization?.split(" ")[1]; // Extract token from 'Authorization: Bearer TOKEN'
    console.log("Received Token:", token); // Debugging step

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const keys = await getCognitoPublicKeys();
        const decodedHeader = jwt.decode(token, { complete: true });
        console.log("Decoded Header:", decodedHeader); // Debugging step

        if (!decodedHeader) {
            return res.status(401).json({ error: "Invalid token." });
        }

        const kid = decodedHeader.header.kid;
        const key = keys.find(k => k.kid === kid);

        if (!key) {
            return res.status(401).json({ error: "Invalid token." });
        }
        
        const pem = jwkToPem(key);
        jwt.verify(token, pem, { algorithms: ["RS256"] }, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Unauthorized: Invalid token." });
            }
            req.user = decoded; // Attach user data to request
            console.log("Decoded Token:", decoded); // Debugging step
            next(); // Proceed to the next middleware
        });

    } catch (error) {
        return res.status(500).json({ error: "Failed to verify token." });
    }
};

module.exports = { verifyToken };
