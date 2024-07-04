const express = require('express');
const Rating = require('../models/Ratings');  // Ensure the path is correct
const router = express.Router();

// Get all ratings
router.get('/ratings', async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a new rating
router.post('/ratings', async (req, res) => {
  const { nickname, correctAnswersCount, totalQuestions } = req.body;

  try {
    const newRating = new Rating({
      nickname,
      correctAnswersCount,
      totalQuestions,
    });

    await newRating.save();
    res.json(newRating);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
