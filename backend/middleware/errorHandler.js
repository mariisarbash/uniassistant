const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: err.message || 'Errore del server'
    });
  };
  
  module.exports = errorHandler;