const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, 
    description: { type: String, default: "" }, 
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: []}], 
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message", default: []}], 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } 
});

module.exports = mongoose.model("Room", roomSchema);
