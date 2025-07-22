const multer = require('multer');
const path = require('path');

// Configurar almacenamiento de archivos para galería
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/artesanos/galeria/');
  },
  filename: (req, file, cb) => {
    // Crear nombre único: timestamp + nombre original
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Filtro de archivos: solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpg, png, gif, etc.)'), false);
  }
};

// Configuración de Multer
const uploadGaleria = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: fileFilter
});

module.exports = uploadGaleria; 