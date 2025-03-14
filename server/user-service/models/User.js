const { v4: uuidv4 } = require("uuid");

const User = (email, username) => {
    return {
        userId: uuidv4(),  // Unique identifier
        email: email,
        username: username,
        createdAt: new Date().toISOString(),
    };
};

module.exports = User;
