const express = require('express');
const router = express.Router();
const studySessionController = require('../controllers/studySessionController');

// Routes for /api/study-sessions
router.get('/', studySessionController.getStudySessions);
router.post('/', studySessionController.createStudySession);
router.delete('/:id', studySessionController.deleteStudySession);

module.exports = router;