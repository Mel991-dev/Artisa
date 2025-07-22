const multer = require('multer');
const path = require('path');

// Configurar almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/productos/');
  },
  filename: (req, file, cb) => {
    // Crear nombre único: timestamp + nombre original
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Configurar filtros de archivo
const fileFilter = (req, file, cb) => {
  // Verificar tipo de archivo
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpg, png, gif, etc.)'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: fileFilter
});

module.exports = upload; 