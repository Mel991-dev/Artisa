// backend/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error('🔴 Error:', err.stack);
    res.status(500).json({
      mensaje: 'Error interno del servidor',
      error: err.message
    });
  }
  
  module.exports = errorHandler;
  