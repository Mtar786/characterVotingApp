require('dotenv').config(); // Load environment variables
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // Allow frontend to communicate with backend
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define Character Schema & Model
const characterSchema = new mongoose.Schema({
  name: String,
  votes: { type: Number, default: 0 }
});
const Character = mongoose.model('Character', characterSchema);

// API Route: Get all characters
app.get('/api/characters', async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// API Route: Vote for a character
app.post('/api/vote', async (req, res) => {
  const { characterId } = req.body;
  try {
    const character = await Character.findByIdAndUpdate(
      characterId,
      { $inc: { votes: 1 } },
      { new: true }
    );

    // Emit updated character data to all clients in real-time
    io.emit('voteUpdate', character);

    res.json(character);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register vote' });
  }
});

// WebSocket Connection for Real-Time Updates
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
