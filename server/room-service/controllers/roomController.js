const Room = require("../models/Room");
const { saveRoom } = require("../services/roomService");

const createRoomController = async (req, res) => {
    try {
        const { name, description, createdBy } = req.body;

        if (!name || !createdBy) {
            return res.status(400).json({ error: "Room name and creator ID are required" });
        }

        const newRoom = Room(name, description, createdBy);
        await saveRoom(newRoom);

        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ error: "Failed to create room" });
    }
};

module.exports = { createRoomController };
