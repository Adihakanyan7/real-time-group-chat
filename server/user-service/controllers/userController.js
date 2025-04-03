const { getUserById, updateUser, deleteUser } = require("../services/userService");



async function fetchUserController(req, res) {
    try {
        const userId = req.user.sub; // Cognito User ID
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await getUserById(userId); // Fetch from DynamoDB
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function updateUserController(req, res) {
    try {
        const userId = req.user.sub; // ✅ Get user ID from token
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const updatedUser = await updateUser(userId, req.body); // ✅ Update in DB
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteUserController(req, res) {
    try {
        const userId = req.user.sub; // ✅ Get user ID from token
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        await deleteUser(userId);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { fetchUserController, updateUserController, deleteUserController };
