const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento de archivos para fotos de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Crear nombre único: perfil-timestamp + nombre original
    const uniqueName = 'perfil-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
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

// Configurar multer para fotos de perfil
const uploadPerfil = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: fileFilter
});

module.exports = uploadPerfil; 