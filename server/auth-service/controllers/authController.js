const { registerUser, loginUser,  confirmUser } = require("../services/cognitoService");

// Register Controller
const registerController = async (req, res) => {
    const { email, password, username  } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ error: "Email, username, and password are required." });
    }

    try {
        const result = await registerUser(email, password, username);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to register user", details: error.message });
    }
};

// Login Controller
const loginController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const tokens = await loginUser(email, password);
        res.status(200).json(tokens);
    } catch (error) {
        res.status(401).json({ error: "Invalid credentials", details: error.message });
    }
};

const confirmUserController = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: "Email and confirmation code are required." });
    }

    try {
        const result = await confirmUser(email, code);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to confirm user", details: error.message });
    }
};

module.exports = { registerController, loginController, confirmUserController };
