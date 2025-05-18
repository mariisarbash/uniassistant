const Course = require('../models/Course');

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  const course = new Course(req.body);
  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Corso non trovato' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Corso non trovato' });
    }
    
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const result = await Course.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Corso non trovato' });
    }
    res.status(200).json({ message: 'Corso eliminato con successo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};