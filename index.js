const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const { Server } = require('http');

const app = express();

app.use(cors({
  origin: ['https://chat-quiz-front.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

const server = Server(app);

const io = socketIo(server, {
  cors: {
    origin: ['https://chat-quiz-front.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

const userResults = {}; // Store results of all users

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('sendQuizAnswer', ({ room, question, selectedAnswer, nickname }) => {
    const isCorrect = quizQuestions.find(q => q.question === question).correctAnswer === selectedAnswer;

    if (!userResults[nickname]) {
      userResults[nickname] = { correctAnswersCount: 0, totalQuestions: 0 };
    }
    userResults[nickname].totalQuestions += 1;
    if (isCorrect) {
      userResults[nickname].correctAnswersCount += 1;
    }

    // Emit to the same room
    io.to(room).emit('receiveQuizAnswer', { question, selectedAnswer, nickname, isCorrect });
  });

  socket.on('getResults', (room) => {
    io.to(room).emit('receiveResults', userResults);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const quizQuestions = [
  { question: "What is the capital of Spain?", answer: "Madrid" },
  { question: "What is 2 + 2?", answer: "4" },
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is the largest planet?", answer: "Jupiter" },
  { question: "What is the boiling point of water in Celsius?", answer: "100" }
];  

io.on('connection', (socket) => {
  console.log(`${socket.id} New user connected`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} Client disconnected`);
  });

  socket.on('joinRoom', (data) => {
    const { room, nickname } = data;
    socket.join(room);
    console.log(`Client ${nickname} joined room: ${room}`);
    io.to(room).emit('message', `User ${nickname} has joined room ${room}`);
    if (!userResults[room]) {
      userResults[room] = {};
    }
    if (!userResults[room][nickname]) {
      userResults[room][nickname] = { correctAnswersCount: 0, totalQuestions: quizQuestions.length };
    }
  });

  socket.on('sendChatMessage', (data) => {
    io.to(data.room).emit('receiveChatMessage', data.message);
  });

  socket.on('sendQuizAnswer', (data) => {
    try {
      const { room, question, selectedAnswer, nickname } = data;
      console.log(`Received answer: ${selectedAnswer} for question: ${question} in room: ${room}`);
      const questionData = quizQuestions.find(q => q.question === question);
      let result = 'Incorrect';
      if (questionData && questionData.answer.toLowerCase() === selectedAnswer.toLowerCase()) {
        result = 'Correct';
        userResults[room][nickname].correctAnswersCount++;
      }
      const responseMessage = `Question: ${question}, Answer: ${selectedAnswer} - ${result}`;
      io.to(room).emit('receiveQuizAnswer', responseMessage);
      console.log(`Broadcasting answer to room ${room}: ${responseMessage}`);
    } catch (error) {
      console.error(`Error processing quiz answer: ${error.message}`);
    }
  });

  socket.on('getResults', (room) => {
    console.log(`Getting results for room: ${room}`);
    const results = userResults[room] || {};
    io.to(room).emit('receiveResults', results);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
