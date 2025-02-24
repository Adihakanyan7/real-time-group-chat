
const express = require('express');
const http = require('http')
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Failed to connect to MongoDB', err);
    });

const messageSchema = new mongoose.Schema({
    username: { type: String, required: true, maxlength: 20 }, // ✅ Ensure max length
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);


io.on('connection', async (socket) => {
    console.log('User connected');
    
    const messages = await Message.find().sort({ timestamp: 1 }).limit(50);
    socket.emit("load messages", messages);

    socket.on('chat message', async ({ username, message }) => {
        if (!username || username.length > 20) {
            return;
        }

        console.log(`${username}: ${message}`);

        const newMessage = new Message({ username, message });
        await newMessage.save();
        
        io.emit('chat message', { username, message });

    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
})
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
