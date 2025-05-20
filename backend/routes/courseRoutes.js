// routes per i corsi

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes for /api/courses
router.get('/', courseController.getCourses);
router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourse);
router.patch('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;