const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg'); // PG library import ki

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  // Ye naye parameters add karein:
  idleTimeoutMillis: 30000,      // 30 seconds idle rehne par connection release kare
  connectionTimeoutMillis: 2000, // 2 seconds tak connect na ho to error de
  max: 20                        // Ek sath maximum 20 connections allow kare
});

// Database connection test
pool.connect((err, client, done) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database se kamyabi se connect ho gaye! ✅');
  }
});

// Updated CORS Middleware
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('TaskPipeline Backend API running successfully! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server port ${PORT} par live chal raha hai... 🔥`);
});