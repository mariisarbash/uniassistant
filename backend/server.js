const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to database
connectDB();

// Import routes
const courseRoutes = require('./routes/courseRoutes');
const studySessionRoutes = require('./routes/studySessionRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const topicRoutes = require('./routes/topicRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5001;

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
app.use('/api/lessons', lessonRoutes);
app.use('/api/topics', topicRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});