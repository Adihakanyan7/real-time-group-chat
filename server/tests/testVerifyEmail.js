const { verifyUserEmail } = require("../auth/auth");

verifyUserEmail("testuser@example.com")
    .then(() => console.log("✅ User email verified successfully"))
    .catch(err => console.error("❌ Error verifying email:", err));
