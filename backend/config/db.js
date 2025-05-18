const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/uniassistant', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connessione a MongoDB completata con successo');
  } catch (err) {
    console.error('Errore di connessione a MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;