const Topic = require('../models/Topic');
const Course = require('../models/Course');

// Ottieni tutti i topic di un corso
exports.getTopicsByCourse = async (req, res) => {
  try {
    const topics = await Topic.find({ courseId: req.params.courseId });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crea un nuovo topic
exports.createTopic = async (req, res) => {
  try {
    console.log('Tentativo di creazione topic:', {
      courseId: req.params.courseId,
      requestBody: req.body
    });
    
    const topic = new Topic({
      courseId: req.params.courseId,
      title: req.body.title,
      parentId: req.body.parentId || null,
      order: req.body.order || 0
    });

    const newTopic = await topic.save();
    console.log('Topic salvato con ID:', newTopic._id);
    
    // Aggiorna il corso con riferimento al nuovo topic
    await Course.findByIdAndUpdate(req.params.courseId, 
      { $push: { topics: newTopic._id } }
    );
    
    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Errore creazione topic:', error);
    res.status(400).json({ message: error.message });
  }
};

// Aggiorna un topic
exports.updateTopic = async (req, res) => {
  try {
    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Elimina un topic
exports.deleteTopic = async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    
    // Rimuovi riferimento dal corso
    await Course.findByIdAndUpdate(req.params.courseId, 
      { $pull: { topics: req.params.id } }
    );
    
    res.json({ message: 'Topic eliminato' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Genera argomenti automaticamente dal programma
exports.generateTopics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { programText } = req.body;
    
    // Qui in futuro integrerai l'intelligenza artificiale per analizzare il programma
    // Per ora, facciamo una semplice suddivisione per righe come esempio
    const lines = programText.split('\n').filter(line => line.trim() !== '');
    
    const topics = [];
    let order = 0;
    
    for (const line of lines) {
      const topic = new Topic({
        courseId,
        title: line.trim(),
        order: order++
      });
      
      const savedTopic = await topic.save();
      topics.push(savedTopic);
      
      // Aggiorna il corso con riferimento al nuovo topic
      await Course.findByIdAndUpdate(courseId, 
        { $push: { topics: savedTopic._id } }
      );
    }
    
    res.status(201).json(topics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};