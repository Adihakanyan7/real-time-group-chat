const express = require("express");
const { createUserController, getUserController, updateUserController, deleteUserController } = require("../controllers/userController");

const router = express.Router();

// Route to create a new user
router.post("/", createUserController);

// Route to get a user by ID
router.get("/:id", getUserController);

// Route to update a user
router.put("/:id", updateUserController);

// Route to delete a user
router.delete("/:id", deleteUserController);

module.exports = router;
