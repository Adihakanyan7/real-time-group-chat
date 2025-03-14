const { login } = require("../auth/auth");

login("testuser@example.com", "TestPassword123!")
    .then(data => console.log("✅ User logged in successfully:", data))
    .catch(err => console.error("❌ Error logging in:", err));
