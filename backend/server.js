const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const courseRoutes = require('./routes/courseRoutes');
const studySessionRoutes = require('./routes/studySessionRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import DB connection
const connectDB = require('./config/db');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/courses', courseRoutes);
app.use('/api/study-sessions', studySessionRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});