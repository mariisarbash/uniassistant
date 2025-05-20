// schema di una sessione di studio 

const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  date: { type: Date, default: Date.now },
  duration: Number, // durata in minuti
  topic: String,
  notes: String
});

module.exports = mongoose.model('StudySession', studySessionSchema);