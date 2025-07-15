// backend/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  // Imprime el error completo en la consola para depuración
    console.error('🔴 Error:', err.stack);
    // Responde al cliente con un mensaje de error y el mensaje específico del error
    res.status(500).json({
      mensaje: 'Error interno del servidor',
      error: err.message
    });
  }
  
  module.exports = errorHandler;
  