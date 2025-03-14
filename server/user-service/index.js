const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use("/users", userRoutes); // Ensure this is included!

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ User Service running on port ${PORT}`);
});
