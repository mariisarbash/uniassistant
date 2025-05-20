const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: { type: String, required: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    default: null
  }, // per supportare sub-topic
  completed: { type: Boolean, default: false },
  order: { type: Number, default: 0 } // per mantenere l'ordine dei topic
});

module.exports = mongoose.model('Topic', topicSchema);