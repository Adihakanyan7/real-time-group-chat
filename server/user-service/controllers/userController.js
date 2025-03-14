const { createUser, getUserById, updateUser, deleteUser } = require("../services/userService");

// Create User Controller
async function createUserController(req, res) {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).json({ error: "Email and username are required" });
        }

        const user = await createUser(email, username);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get User by ID Controller
async function getUserController(req, res) {
    try {
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update User Controller
async function updateUserController(req, res) {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete User Controller
async function deleteUserController(req, res) {
    try {
        await deleteUser(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createUserController, getUserController, updateUserController, deleteUserController };
