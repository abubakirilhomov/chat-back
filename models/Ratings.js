const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
  },
  correctAnswersCount: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = Rating;
