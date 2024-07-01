const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const { Server } = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const { Low, JSONFile } = require('lowdb');

const app = express();
const server = Server(app);
const io = socketIo(server, {
  cors: {
    origin: ['https://chat-quiz-front.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(bodyParser.json());

const adapter = new JSONFile('db.json');
const db = new Low(adapter);

app.post('/results', async (req, res) => {
  const { nickname, correctAnswersCount, totalQuestions } = req.body;

  await db.read();
  const results = db.data.results || [];

  const existingUser = results.find(result => result.nickname === nickname);
  if (existingUser) {
    existingUser.correctAnswersCount = correctAnswersCount;
    existingUser.totalQuestions = totalQuestions;
  } else {
    results.push({ nickname, correctAnswersCount, totalQuestions });
  }

  db.data.results = results;
  await db.write();

  res.json({ message: 'Results saved successfully' });
});

app.get('/ratings', async (req, res) => {
  await db.read();
  const results = db.data.results || [];
  res.json(results);
});

io.on('connection', (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('sendQuizAnswer', (data) => {
    io.to(data.room).emit('receiveQuizAnswer', data);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
