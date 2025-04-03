require("dotenv").config();
const express = require("express");
const cors = require("cors");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Message Routes
app.use("/messages", messageRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`🚀 Chat Service is running on port ${PORT}`);
});
