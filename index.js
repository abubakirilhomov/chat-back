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

const quizQuestions = [
  { question: "What is the capital of Spain?", answer: "Madrid" },
  { question: "What is 2 + 2?", answer: "4" },
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "What is the largest planet?", answer: "Jupiter" },
  { question: "What is the boiling point of water in Celsius?", answer: "100" }
];

const userResults = {};

io.on('connection', (socket) => {
  console.log(`${socket.id} New user connected`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} Client disconnected`);
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Client joined room: ${room}`);
    io.to(room).emit('message', `A new user has joined room ${room}`);
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
      }
      const responseMessage = `Question: ${question}, Answer: ${selectedAnswer} - ${result}`;
      io.to(room).emit('receiveQuizAnswer', responseMessage);
      console.log(`Broadcasting answer to room ${room}: ${responseMessage}`);

      // Update user results
      if (!userResults[room]) {
        userResults[room] = {};
      }
      if (!userResults[room][nickname]) {
        userResults[room][nickname] = { correctAnswersCount: 0, totalQuestions: quizQuestions.length };
      }
      if (result === 'Correct') {
        userResults[room][nickname].correctAnswersCount++;
      }
    } catch (error) {
      console.error(`Error processing quiz answer: ${error.message}`);
    }
  });

  socket.on('getResults', (room) => {
    io.to(room).emit('receiveResults', userResults[room]);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
