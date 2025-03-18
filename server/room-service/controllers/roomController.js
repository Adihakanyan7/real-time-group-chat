const Room = require("../models/Room");
const { saveRoom } = require("../services/roomService");
const { getRoomById, getPaginatedRooms, updateRoom, deleteRoomById } = require("../services/roomService");

const createRoomController = async (req, res) => {
    try {
        console.log("Request body:", req.body);

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

const getRoomByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Received request to fetch room with ID: ${id}`);

        const room = await getRoomById(id);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json(room);
    } catch (error) {
        console.error("❌ Error in getRoomByIdController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

async function getPaginatedRoomsController(req, res) {
    try {
        const lastKey = req.query.lastKey || null; // Get lastKey from query parameters

        const result = await getPaginatedRooms(lastKey);

        return res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error in pagination controller:", error);
        return res.status(500).json({ message: "Error fetching paginated rooms" });
    }
}
async function updateRoomController(req, res) {
    try {
        const roomId = req.params.id;
        const updates = req.body;

        if (!updates.name || !updates.description) {
            return res.status(400).json({ message: "Name and description are required for update." });
        }

        const updatedRoom = await updateRoom(roomId, updates);

        if (!updatedRoom) {
            return res.status(404).json({ message: "Room not found." });
        }
        console.log("Room updated:", updatedRoom);
        res.json(updatedRoom);
    } catch (error) {
        res.status(500).json({ message: "Error updating room", error: error.message });
    }
}  

async function deleteRoomController(req, res) {
    try {
        const { id } = req.params;
        console.log(`🔄 Received request to delete room with ID: ${id}`);

        const result = await deleteRoomById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete room" });
    }
}


module.exports = { createRoomController, getRoomByIdController, getPaginatedRoomsController, updateRoomController, deleteRoomController };
