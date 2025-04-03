const Message = require("../models/Message");
const { saveMessage, getMessagesByRoomId, updateMessage, deleteMessageById } = require("../services/messageService");

// Controller to send a new message
const sendMessageController = async (req, res) => {
    try {
        const { roomId, userId, text } = req.body;

        if (!roomId || !userId || !text) {
            return res.status(400).json({ error: "roomId, userId, and text are required" });
        }

        const newMessage = Message(roomId, userId, text);
        await saveMessage(newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
};

// Controller to get messages from a specific room
const getMessagesController = async (req, res) => {
    try {
        const { roomId } = req.params;
        console.log(`🔍 Fetching messages for room ID: ${roomId}`);

        const messages = await getMessagesByRoomId(roomId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve messages" });
    }
};

// Controller to edit a message
const editMessageController = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "New text is required" });
        }

        const updatedMessage = await updateMessage(id, text);
        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(500).json({ error: "Failed to edit message" });
    }
};

// Controller to delete a message
const deleteMessageController = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deleteMessageById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete message" });
    }
};

module.exports = { sendMessageController, getMessagesController, editMessageController, deleteMessageController };
