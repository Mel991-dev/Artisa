// backend/controllers/galeria.controller.js
const galeriaModel = require('../models/galeria.model');
const fs = require('fs');
const path = require('path');

// Validación de datos de la galería
function validarDatosGaleria(datos) {
  const errores = [];
  
  if (!datos.id_artesano) {
    errores.push('ID de artesano es requerido.');
  }
  
  if (datos.descripcion && datos.descripcion.length > 500) {
    errores.push('La descripción no puede exceder 500 caracteres.');
  }
  
  return errores;
}

/**
 * Obtiene todas las imágenes de la galería de un artesano específico
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function obtenerGaleriaArtesano(req, res) {
  try {
    console.log('=== OBTENER GALERÍA ARTESANO ===');
    const { id_artesano } = req.params;
    console.log('ID Artesano:', id_artesano);

    const galeria = await galeriaModel.obtenerGaleriaPorArtesano(id_artesano);
    console.log('Galería obtenida:', galeria);

    res.json(galeria);
  } catch (error) {
    console.error('Error al obtener galería del artesano:', error);
    res.status(500).json({ 
      msg: 'Error al obtener la galería del artesano', 
      error: error.message 
    });
  }
}

/**
 * Obtiene todas las imágenes de la galería (para administración)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function obtenerTodaGaleria(req, res) {
  try {
    console.log('=== OBTENER TODA LA GALERÍA ===');
    
    const galeria = await galeriaModel.obtenerTodaGaleria();
    console.log('Galería completa obtenida');

    res.json(galeria);
  } catch (error) {
    console.error('Error al obtener toda la galería:', error);
    res.status(500).json({ 
      msg: 'Error al obtener la galería', 
      error: error.message 
    });
  }
}

// Obtener una foto específica
async function obtenerGaleriaPorId(req, res) {
  try {
    const { id_galeria } = req.params;
    const galeria = await galeriaModel.obtenerGaleriaPorId(id_galeria);
    
    if (!galeria) {
      return res.status(404).json({ msg: 'Foto no encontrada.' });
    }
    
    res.json(galeria);
  } catch (err) {
    console.error('Error al obtener foto:', err);
    res.status(500).json({ msg: 'Error al obtener la foto', error: err.message });
  }
}

// Crear nueva foto en galería
async function crearGaleria(req, res) {
  try {
    console.log('=== INICIO CREAR GALERÍA ===');
    console.log('URL de la petición:', req.url);
    console.log('Método HTTP:', req.method);
    console.log('Headers:', req.headers);
    console.log('Body recibido:', req.body);
    console.log('Archivo recibido:', req.file);
    console.log('Files:', req.files);
    
    // Obtener id_artesano del usuario autenticado
    const datos = {
      id_artesano: req.user.id_usuario,
      ...req.body
    };
    console.log('Datos a procesar:', datos);
    const errores = validarDatosGaleria(datos);
    
    if (errores.length > 0) {
      console.log('Errores de validación:', errores);
      return res.status(400).json({ errores });
    }

    // Verificar límite de fotos (máximo 5 por artesano)
    const totalFotos = await galeriaModel.contarFotosPorArtesano(datos.id_artesano);
    if (totalFotos >= 5) {
      return res.status(400).json({ msg: 'Has alcanzado el límite máximo de 5 fotos.' });
    }

    // Procesar imagen si se subió
    let rutaArchivo = null;
    let nombreArchivo = null;
    
    if (req.file) {
      nombreArchivo = req.file.filename;
      rutaArchivo = `/uploads/artesanos/galeria/${req.file.filename}`;
      console.log('Imagen procesada:', rutaArchivo);
      console.log('Archivo guardado en:', req.file.path);
    } else {
      console.log('No se subió imagen');
      console.log('req.file:', req.file);
      console.log('req.files:', req.files);
      return res.status(400).json({ msg: 'Debes seleccionar una imagen.' });
    }

    const datosGaleria = {
      id_artesano: parseInt(datos.id_artesano),
      nombre_archivo: nombreArchivo,
      ruta_archivo: rutaArchivo,
      descripcion: datos.descripcion || null,
      es_principal: datos.es_principal === 'true' ? 1 : 0
    };
    
    console.log('Datos a insertar en BD:', datosGaleria);

    const id_galeria = await galeriaModel.crearGaleria(datosGaleria);
    console.log('Foto creada con ID:', id_galeria);

    // Si es foto principal, establecerla como tal
    if (datos.es_principal === 'true') {
      await galeriaModel.establecerFotoPrincipal(id_galeria, datos.id_artesano);
    }

    res.status(201).json({ 
      msg: 'Foto agregada correctamente.',
      id_galeria,
      ruta_archivo: rutaArchivo
    });
    
    console.log('=== FIN CREAR GALERÍA ===');
  } catch (err) {
    console.error('Error al crear foto:', err);
    res.status(500).json({ msg: 'Error al crear la foto', error: err.message });
  }
}

// Actualizar foto de galería (descripción e imagen)
async function actualizarGaleria(req, res) {
  try {
    console.log('=== INICIO ACTUALIZAR GALERÍA ===');
    console.log('Params recibidos:', req.params);
    console.log('Body recibido:', req.body);
    console.log('Archivo recibido:', req.file);
    
    const { id_galeria } = req.params;
    const datos = req.body;
    const archivo = req.file;
    
    // Verificar que la foto existe
    const fotoExistente = await galeriaModel.obtenerGaleriaPorId(id_galeria);
    if (!fotoExistente) {
      console.log('Error: Foto no encontrada');
      return res.status(404).json({ msg: 'Foto no encontrada.' });
    }

    // Validar que el usuario autenticado es el propietario de la foto
    if (fotoExistente.id_artesano !== req.user.id_usuario) {
      console.log('Error: Usuario no autorizado');
      return res.status(403).json({ msg: 'No tienes permisos para actualizar esta foto.' });
    }

    // Preparar datos de actualización
    const datosActualizados = {
      id_galeria: parseInt(id_galeria),
      descripcion: datos.descripcion || fotoExistente.descripcion
    };

    // Si se subió una nueva imagen
    if (archivo) {
      console.log('Nueva imagen recibida:', archivo.originalname);
      
      // Validar tipo de archivo
      if (!archivo.mimetype.startsWith('image/')) {
        return res.status(400).json({ msg: 'El archivo debe ser una imagen.' });
      }

      // Validar tamaño (5MB)
      if (archivo.size > 5 * 1024 * 1024) {
        return res.status(400).json({ msg: 'La imagen debe ser menor a 5MB.' });
      }

      // Eliminar imagen anterior si existe
      const rutaImagenAnterior = path.join(__dirname, '..', 'uploads', 'artesanos', 'galeria', fotoExistente.nombre_archivo);
      if (fs.existsSync(rutaImagenAnterior)) {
        fs.unlinkSync(rutaImagenAnterior);
        console.log('Imagen anterior eliminada:', rutaImagenAnterior);
      }

      // Actualizar datos con nueva imagen
      datosActualizados.nombre_archivo = archivo.filename;
      datosActualizados.ruta_archivo = `/uploads/artesanos/galeria/${archivo.filename}`;
    }

    // Validar descripción
    if (datosActualizados.descripcion && datosActualizados.descripcion.length > 500) {
      return res.status(400).json({ msg: 'La descripción no puede exceder 500 caracteres.' });
    }
    
    console.log('Datos a actualizar en BD:', datosActualizados);

    // Actualizar en base de datos
    await galeriaModel.actualizarGaleria(datosActualizados);
    console.log('Foto actualizada correctamente');

    // Obtener la foto actualizada para devolverla
    const fotoActualizada = await galeriaModel.obtenerGaleriaPorId(id_galeria);

    res.json({ 
      msg: 'Foto actualizada correctamente.',
      foto: fotoActualizada
    });
    
    console.log('=== FIN ACTUALIZAR GALERÍA ===');
  } catch (err) {
    console.error('Error al actualizar foto:', err);
    res.status(500).json({ msg: 'Error al actualizar la foto', error: err.message });
  }
}

// Eliminar foto
async function eliminarGaleria(req, res) {
  try {
    const { id_galeria } = req.params;
    
    // Verificar que la foto existe
    const fotoExistente = await galeriaModel.obtenerGaleriaPorId(id_galeria);
    if (!fotoExistente) {
      return res.status(404).json({ msg: 'Foto no encontrada.' });
    }

    // Eliminar archivo físico si existe
    const rutaCompleta = path.join(__dirname, '..', 'uploads', 'artesanos', 'galeria', fotoExistente.nombre_archivo);
    if (fs.existsSync(rutaCompleta)) {
      fs.unlinkSync(rutaCompleta);
      console.log('Archivo eliminado:', rutaCompleta);
    }

    await galeriaModel.eliminarGaleria(id_galeria);
    res.json({ msg: 'Foto eliminada correctamente.' });
  } catch (err) {
    console.error('Error al eliminar foto:', err);
    res.status(500).json({ msg: 'Error al eliminar la foto', error: err.message });
  }
}

// Establecer foto como principal
async function establecerFotoPrincipal(req, res) {
  try {
    const { id_galeria } = req.params;
    const { id_artesano } = req.body;
    
    // Verificar que la foto existe
    const fotoExistente = await galeriaModel.obtenerGaleriaPorId(id_galeria);
    if (!fotoExistente) {
      return res.status(404).json({ msg: 'Foto no encontrada.' });
    }

    await galeriaModel.establecerFotoPrincipal(id_galeria, id_artesano);
    res.json({ msg: 'Foto establecida como principal correctamente.' });
  } catch (err) {
    console.error('Error al establecer foto principal:', err);
    res.status(500).json({ msg: 'Error al establecer la foto principal', error: err.message });
  }
}

// Obtener foto principal de un artesano
async function obtenerFotoPrincipal(req, res) {
  try {
    const { id_artesano } = req.params;
    const fotoPrincipal = await galeriaModel.obtenerFotoPrincipal(id_artesano);
    
    if (!fotoPrincipal) {
      return res.status(404).json({ msg: 'No se encontró foto principal.' });
    }
    
    res.json(fotoPrincipal);
  } catch (err) {
    console.error('Error al obtener foto principal:', err);
    res.status(500).json({ msg: 'Error al obtener la foto principal', error: err.message });
  }
}

module.exports = {
  obtenerGaleriaArtesano,
  obtenerTodaGaleria,
  obtenerGaleriaPorId,
  crearGaleria,
  actualizarGaleria,
  eliminarGaleria,
  establecerFotoPrincipal,
  obtenerFotoPrincipal
}; 