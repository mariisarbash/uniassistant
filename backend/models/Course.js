const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  professor: String,
  credits: Number,
  startDate: Date,
  endDate: Date,
  color: String,
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  topics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }]
});

module.exports = mongoose.model('Course', courseSchema);