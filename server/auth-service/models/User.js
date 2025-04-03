const { v4: uuidv4 } = require("uuid");

const User = (userId, email, username) => {
    return {
        userId: userId,  // Use Cognito sub as userId (unique identifier)
        email: email,
        username: username,
        createdAt: new Date().toISOString(),
    };
};

module.exports = User;
