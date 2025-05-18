const StudySession = require('../models/StudySession');

// Get all study sessions
exports.getStudySessions = async (req, res) => {
  try {
    const sessions = await StudySession.find().populate('course');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new study session
exports.createStudySession = async (req, res) => {
  const session = new StudySession(req.body);
  try {
    const newSession = await session.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a study session
exports.deleteStudySession = async (req, res) => {
  try {
    const result = await StudySession.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Sessione non trovata' });
    }
    res.status(200).json({ message: 'Sessione eliminata con successo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};