const User = require("../models/User");

const testUser = User("test@example.com", "testuser");
console.log("✅ Test User Model:", testUser);
1