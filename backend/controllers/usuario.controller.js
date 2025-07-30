// backend/controllers/usuario.controller.js
const usuarioModel = require('../models/usuario.model');
const { poolPromise, sql } = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para subida de fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    console.log('Multer destination:', uploadDir);
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Directorio uploads creado:', uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para la imagen
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'perfil-' + uniqueSuffix + ext;
    console.log('Multer filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: function (req, file, cb) {
    console.log('Multer fileFilter - mimetype:', file.mimetype);
    // Verificar que sea una imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen.'), false);
    }
  }
}).single('foto');

// Validación de datos de usuario
function validarDatosUsuario(datos) {
  const errores = [];
  
  if (!datos.nombre || datos.nombre.length < 2) {
    errores.push('El nombre debe tener al menos 2 caracteres.');
  }
  
  if (!datos.apellido || datos.apellido.length < 2) {
    errores.push('El apellido debe tener al menos 2 caracteres.');
  }
  
  if (!datos.correo || !datos.correo.includes('@')) {
    errores.push('El correo electrónico es obligatorio y debe ser válido.');
  }
  
  if (!datos.direccion || datos.direccion.length < 5) {
    errores.push('La dirección debe tener al menos 5 caracteres.');
  }
  
  if (!datos.pais || datos.pais.length < 2) {
    errores.push('El país es obligatorio.');
  }
  
  // Validar contraseña solo si se proporciona (para actualización)
  if (datos.contraseña && datos.contraseña.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres.');
  }
  
  return errores;
}

// Validación de datos específicos de artesano
function validarDatosArtesano(datos) {
  const errores = [];
  
  if (!datos.especialidad || datos.especialidad.length < 3) {
    errores.push('La especialidad es obligatoria y debe tener al menos 3 caracteres.');
  }
  
  if (!datos.biografia || datos.biografia.length < 10 || datos.biografia.length > 500) {
    errores.push('La biografía debe tener entre 10 y 500 caracteres.');
  }
  
  if (!datos.historia || datos.historia.length < 10 || datos.historia.length > 1000) {
    errores.push('La historia debe tener entre 10 y 1000 caracteres.');
  }
  
  return errores;
}

// Obtener perfil del usuario autenticado
async function obtenerPerfil(req, res) {
  try {
    console.log('=== OBTENER PERFIL ===');
    console.log('Usuario autenticado:', req.user);
    console.log('ID del usuario:', req.user?.id_usuario);
    
    const id_usuario = req.user?.id_usuario;
    const perfil = await usuarioModel.obtenerPerfilCompleto(id_usuario);
    
    console.log('Perfil obtenido:', perfil);
    
    if (!perfil) {
      console.log('Perfil no encontrado');
      return res.status(404).json({ msg: 'Perfil no encontrado.' });
    }
    
    console.log('Enviando perfil al frontend');
    res.json(perfil);
  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ msg: 'Error al obtener el perfil', error: err.message });
  }
}

// Actualizar perfil del usuario autenticado
async function actualizarPerfil(req, res) {
  try {
    console.log('=== ACTUALIZAR PERFIL ===');
    console.log('Usuario autenticado:', req.user);
    console.log('Datos recibidos:', req.body);
    console.log('Archivo recibido:', req.file);
    console.log('Headers recibidos:', req.headers);
    
    const id_usuario = req.user.id_usuario;
    const datos = req.body;
    
    console.log('ID usuario:', id_usuario);
    console.log('Datos a procesar:', datos);
    
    // Validar datos básicos de usuario
    const erroresUsuario = validarDatosUsuario(datos);
    if (erroresUsuario.length > 0) {
      console.log('Errores de validación:', erroresUsuario);
      return res.status(400).json({ errores: erroresUsuario });
    }
    
    // Si es artesano, validar datos específicos
    if (datos.rol === 'artesano') {
      const erroresArtesano = validarDatosArtesano(datos);
      if (erroresArtesano.length > 0) {
        console.log('Errores de validación artesano:', erroresArtesano);
        return res.status(400).json({ errores: erroresArtesano });
      }
    }
    
    // Si se subió una nueva foto, agregar el nombre del archivo a los datos
    if (req.file) {
      datos.foto = req.file.filename;
      console.log('Nueva foto guardada:', req.file.filename);
    }
    
    console.log('Datos finales para actualizar:', datos);
    
    // Actualizar perfil
    await usuarioModel.actualizarPerfilCompleto(id_usuario, datos);
    console.log('Perfil actualizado en la base de datos');
    
    // Obtener el perfil actualizado para devolver la información completa
    const perfilActualizado = await usuarioModel.obtenerPerfilCompleto(id_usuario);
    console.log('Perfil actualizado obtenido:', perfilActualizado);
    
    console.log('Perfil actualizado correctamente');
    res.json({ 
      msg: 'Perfil actualizado correctamente.',
      foto: datos.foto || perfilActualizado.foto,
      usuario: perfilActualizado
    });
  } catch (err) {
    console.error('Error detallado al actualizar perfil:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ msg: 'Error al actualizar el perfil', error: err.message });
  }
}

// Obtener perfil público de un usuario
async function obtenerPerfilPublico(req, res) {
  try {
    const { id_usuario } = req.params;
    const perfil = await usuarioModel.obtenerPerfilPublico(id_usuario);
    
    if (!perfil) {
      return res.status(404).json({ msg: 'Perfil no encontrado.' });
    }
    
    res.json(perfil);
  } catch (err) {
    console.error('Error al obtener perfil público:', err);
    res.status(500).json({ msg: 'Error al obtener el perfil público', error: err.message });
  }
}

// Middleware para manejar la subida de archivos
function uploadMiddleware(req, res, next) {
  console.log('=== UPLOAD MIDDLEWARE ===');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body antes de multer:', req.body);
  
  upload(req, res, function (err) {
    console.log('Multer callback ejecutado');
    console.log('Error de multer:', err);
    console.log('Archivo después de multer:', req.file);
    console.log('Body después de multer:', req.body);
    
    if (err instanceof multer.MulterError) {
      console.log('Error de multer:', err.code);
      // Error de multer
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'El archivo es demasiado grande. Máximo 5MB.' });
      }
      return res.status(400).json({ msg: 'Error al subir el archivo.' });
    } else if (err) {
      console.log('Otro tipo de error:', err.message);
      // Otro tipo de error
      return res.status(400).json({ msg: err.message });
    }
    // Todo bien, continuar
    console.log('Multer completado exitosamente');
    next();
  });
}

module.exports = {
  obtenerPerfil,
  actualizarPerfil,
  obtenerPerfilPublico,
  uploadMiddleware
}; 