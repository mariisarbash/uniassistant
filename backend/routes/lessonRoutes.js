const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

router.get('/course/:courseId', lessonController.getLessonsByCourse);
router.post('/course/:courseId', lessonController.createLesson);
router.put('/:id', lessonController.updateLesson);
router.delete('/:id/course/:courseId', lessonController.deleteLesson);

module.exports = router;