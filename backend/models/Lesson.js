const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: Number, 
    default: 0 
  }, // durata in minuti
  completed: { 
    type: Boolean, 
    default: false 
  },
  notes: String,
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);