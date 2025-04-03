const express = require("express");
const { registerController, loginController, confirmUserController } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected route example (User Profile)
router.get("/profile", verifyToken, (req, res) => {
    res.json({ message: "Access granted!", user: req.user });
});


router.post("/register", registerController);
router.post("/login", loginController);
router.post("/confirm", confirmUserController);
module.exports = router;




