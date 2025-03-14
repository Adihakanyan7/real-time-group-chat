const { signUp } = require("../auth/auth");

signUp("testuser@example.com", "TestPassword123!")
    .then(data => console.log("✅ User signed up successfully:", data))
    .catch(err => console.error("❌ Error signing up:", err));
