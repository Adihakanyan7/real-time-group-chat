const express = require('express');
const roomRoutes = require("./routes/roomRoutes"); 
require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/rooms", roomRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Room Service is running on port ${PORT}`);
});