// const express = require('express');
// const axios = require('axios');
// const router = express.Router();

// const MONGO_API_URL = 'https://ap-south-1.aws.data.mongodb-api.com/app/data-oextdya/endpoint/data/v1/action/find';
// const API_KEY = 'wKjkh7w8HpOSadnjnaJLQ1sVc6MaH7KzMLgtSYAKFQZoeLTJa4pKmSRr1GpaC3NU'; // Replace with your actual API key

// // Get all ratings
// router.get('/ratings', async (req, res) => {
//   try {
//     const response = await axios.post(
//       MONGO_API_URL,
//       {
//         dataSource: 'Cluster0',
//         database: 'quiz-db1',
//         collection: 'usersRatings',
//         filter: {}, // Add any specific filter if needed
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'api-key': API_KEY,
//         },
//       }
//     );
//     console.log('Response from MongoDB:', response.data); // Add logging for the response
//     res.json(response.data.documents); // Adjust the path based on the response structure
//   } catch (error) {
//     console.error('Error fetching ratings:', error.response ? error.response.data : error.message);
//     res.status(500).json({ message: 'Server Error', error: error.response ? error.response.data : error.message });
//   }
// });

// module.exports = router;
