const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, maxlength: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    searchedRooms: { type: [String], default: [] },
    subscribedRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: [] }],
    myRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: [] }]
});

module.exports = mongoose.model('User', userSchema);