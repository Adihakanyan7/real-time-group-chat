const express = require("express");
const { createRoomController } = require("../controllers/roomController");

const router = express.Router();

// Route to create a new room
router.post("/", createRoomController);

module.exports = router;
