const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
// const connectDB = require('./db'); // MongoDB connection
// const ratingRoutes = require('./routes/ratings'); // MongoDB routes

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
app.get('/getResults', async (req, res) => {
  // const resultsData = await ResultModel.find(); // Fetch results from MongoDB
  // res.json(resultsData); // Send results as JSON response
  res.json([]); // Placeholder response
});
// Routes
// app.use('/api', ratingRoutes); // MongoDB rating routes

// connectDB(); // Connect to MongoDB

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Client joined room: ${room}`);
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`Client left room: ${room}`);
  });

  socket.on('sendChatMessage', ({ message, room }) => {
    io.to(room).emit('receiveChatMessage', message);
    console.log(`Message sent to room ${room}: `, message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
