// backend/debug-galeria.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Verificar que las carpetas existan
const uploadDir = path.join(__dirname, 'uploads', 'artesanos', 'galeria');
console.log('📁 Verificando carpeta de uploads:', uploadDir);

if (!fs.existsSync(uploadDir)) {
  console.log('❌ La carpeta no existe, creándola...');
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Carpeta creada');
} else {
  console.log('✅ La carpeta existe');
}

// Verificar permisos
try {
  fs.accessSync(uploadDir, fs.constants.W_OK);
  console.log('✅ Permisos de escritura OK');
} catch (err) {
  console.log('❌ Error de permisos:', err.message);
}

// Probar configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Destino configurado:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    console.log('📝 Nombre de archivo generado:', uniqueName);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 Verificando archivo:', file.originalname, file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

console.log('✅ Configuración de multer OK');
console.log('🎯 Para probar:');
console.log('1. Asegúrate de que el backend esté corriendo: npm start');
console.log('2. Intenta subir una imagen desde el frontend');
console.log('3. Revisa los logs del backend para ver qué está pasando'); 