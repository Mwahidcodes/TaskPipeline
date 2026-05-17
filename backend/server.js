const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors()); // Frontend ko connect karne ki ijazat deta hai
app.use(express.json()); // JSON data read karne ke liye

// API Routes Links
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Test Route to check if backend is running
app.get('/', (req, res) => {
    res.send('TaskPipeline Backend API running successfully! 🚀');
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server port ${PORT} par live chal raha hai... 🔥`);
});