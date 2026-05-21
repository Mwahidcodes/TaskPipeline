const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');
const client = require('prom-client'); // 1. Library import karein

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// 2. Metrics Setup: Default system metrics collect karne ke liye
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  max: 20
});

// Database connection test
pool.connect((err, client, done) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database se kamyabi se connect ho gaye! ✅');
  }
});

// Middleware
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 3. Metrics Endpoint: Prometheus yahan se data pull karega
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

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