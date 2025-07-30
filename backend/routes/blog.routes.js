const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
// const auth = require('../middleware/auth'); // Si quieres proteger la creación
const multer = require('multer');

// Configuración básica de multer para imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/blog'); // Carpeta para imágenes de blog
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Crear artículo (con imagen)
router.post('/articulos', upload.single('imagen_blog'), blogController.createArticulo);

// Listar todos los artículos
router.get('/articulos', blogController.getArticulos);

// Obtener artículo por id
router.get('/articulos/:id_post', blogController.getArticuloPorId);
module.exports = router;
