const express = require("express");
const { fetchUserController, updateUserController, deleteUserController } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", verifyToken, fetchUserController);
router.patch("/", verifyToken, updateUserController);
router.delete("/", verifyToken, deleteUserController);

module.exports = router;
