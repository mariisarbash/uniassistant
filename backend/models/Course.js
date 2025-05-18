const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  professor: String,
  credits: Number,
  startDate: Date,
  endDate: Date,
  color: String
});

module.exports = mongoose.model('Course', courseSchema);