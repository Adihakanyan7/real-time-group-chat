const express = require("express");
const { sendMessageController, getMessagesController, editMessageController, deleteMessageController } = require("../controllers/messageController");

const router = express.Router();

router.post("/", sendMessageController); // Send a new message
router.get("/:roomId", getMessagesController); // Get all messages for a room
router.put("/:id", editMessageController); // Edit a message
router.delete("/:id", deleteMessageController); // Delete a message

module.exports = router;
