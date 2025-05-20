// routes per il programma con i topic 

const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

router.get('/course/:courseId', topicController.getTopicsByCourse);
router.post('/course/:courseId', topicController.createTopic);
router.put('/:id', topicController.updateTopic);
router.delete('/:id/course/:courseId', topicController.deleteTopic);
router.post('/course/:courseId/generate', topicController.generateTopics);

module.exports = router;