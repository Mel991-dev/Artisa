// backend/middleware/logger.js
function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // pasa al siguiente middleware o ruta
  }
  
  module.exports = logger;
  