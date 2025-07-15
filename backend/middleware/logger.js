// backend/middleware/logger.js
function logger(req, res, next) {
  // Imprime en consola la fecha, el método y la URL de la petición
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    // Llama al siguiente middleware o ruta
    next(); // pasa al siguiente middleware o ruta
  }
  
  module.exports = logger;
  