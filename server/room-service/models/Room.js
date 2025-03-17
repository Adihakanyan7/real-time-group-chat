const { v4: uuidv4 } = require("uuid");

const Room = (name, description, createdBy) => {
    return {
        roomId: uuidv4(), // Unique identifier for the room
        name: name,
        description: description || "", // Optional description
        createdBy: createdBy, // User ID of the creator
        createdAt: new Date().toISOString(), // Timestamp of room creation
    };
};

module.exports = Room;
