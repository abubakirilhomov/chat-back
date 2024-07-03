//mongodb+srv://2ilhomovabubakir2:ytgb25RKMpjrf1x4@cluster0.ijidzzs.mongodb.net/quiz-db1?retryWrites=true&w=majority&appName=Cluster0
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./db');
const ratingRoutes = require('./routes/ratings');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['https://chat-quiz-front.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', ratingRoutes);

connectDB();

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('sendQuizAnswer', (data) => {
    io.to(data.room).emit('receiveQuizAnswer', data);
    console.log(`Quiz answer sent to room: ${data.room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
