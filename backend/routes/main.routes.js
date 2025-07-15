const express = require('express');
const router = express.Router(); //crear la principal
const authRoutes = require('./auth'); // o el nombre correcto

router.use('/auth', authRoutes);

module.exports = router; //exportar la ruta principal



// backend/routes/main.routes.js
/*const express = require('express');
const router = express.Router();

// Ruta base de prueba
router.get('/', (req, res) => {
  res.json({ mensaje: 'Hola desde el backend de Artisa 🧶' });
});

module.exports = router;*/
