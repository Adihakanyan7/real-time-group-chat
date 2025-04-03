const { v4: uuidv4 } = require("uuid");

const Message = (roomId, userId, text) => {
    return {
        messageId: uuidv4(),  
        roomId: roomId,       // ID of the room where the message is sent
        userId: userId,       // ID of the user who sent the message
        text: text,           // Message content
        timestamp: new Date().toISOString(), // When the message was created
        edited: false         // Boolean to track if the message was edited
    };
};

module.exports = Message;
