const express = require("express");
const { createRoomController, getRoomByIdController, getPaginatedRoomsController, updateRoomController, deleteRoomController } = require("../controllers/roomController");

const router = express.Router();

// Route to create a new room
router.post("/", createRoomController);

router.get("/paginated", getPaginatedRoomsController);
router.get("/:id", getRoomByIdController);

router.put("/:id", updateRoomController);

router.delete("/:id", deleteRoomController);
module.exports = router;
