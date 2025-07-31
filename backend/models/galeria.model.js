// backend/models/galeria.model.js
const { poolPromise, sql } = require('../db');

/**
 * Obtiene la galería de un artesano específico
 * @param {number} id_artesano
 * @returns {Array} Array de imágenes de la galería
 */
async function obtenerGaleriaPorArtesano(id_artesano) {
  try {
    console.log('=== OBTENER GALERÍA POR ARTESANO ===');
    console.log('ID Artesano:', id_artesano);
    
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id_artesano', sql.Int, id_artesano)
      .query(`
        SELECT id_galeria, id_artesano, nombre_archivo, ruta_archivo, descripcion, es_principal, fecha_subida
        FROM GaleriaArtesano 
        WHERE id_artesano = @id_artesano 
        ORDER BY es_principal DESC, fecha_subida DESC
      `);
    
    console.log('Galería obtenida:', result.recordset);
    return result.recordset;
  } catch (error) {
    console.error('Error en obtenerGaleriaPorArtesano:', error);
    throw error;
  }
}

/**
 * Obtiene toda la galería (para administración)
 * @returns {Array} Array de todas las imágenes
 */
async function obtenerTodaGaleria() {
  try {
    console.log('=== OBTENER TODA LA GALERÍA ===');
    
    const pool = await poolPromise;
    
    const result = await pool.request()
      .query(`
        SELECT g.id_galeria, g.id_artesano, g.nombre_archivo, g.ruta_archivo, 
               g.descripcion, g.es_principal, g.fecha_creacion,
               u.nombre, u.apellido
        FROM GaleriaArtesano g
        INNER JOIN Usuario u ON g.id_artesano = u.id_usuario
        ORDER BY g.fecha_creacion DESC
      `);
    
    console.log('Toda la galería obtenida');
    return result.recordset;
  } catch (error) {
    console.error('Error en obtenerTodaGaleria:', error);
    throw error;
  }
}

/**
 * Obtiene una imagen específica por ID
 * @param {number} id_galeria
 * @returns {Object} Imagen de la galería
 */
async function obtenerGaleriaPorId(id_galeria) {
  try {
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id_galeria', sql.Int, id_galeria)
      .query('SELECT * FROM GaleriaArtesano WHERE id_galeria = @id_galeria');
    
    return result.recordset[0] || null;
  } catch (error) {
    console.error('Error en obtenerGaleriaPorId:', error);
    throw error;
  }
}

/**
 * Cuenta las fotos de un artesano
 * @param {number} id_artesano
 * @returns {number} Número de fotos
 */
async function contarFotosPorArtesano(id_artesano) {
  try {
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id_artesano', sql.Int, id_artesano)
      .query('SELECT COUNT(*) as total FROM GaleriaArtesano WHERE id_artesano = @id_artesano');
    
    return result.recordset[0].total;
  } catch (error) {
    console.error('Error en contarFotosPorArtesano:', error);
    throw error;
  }
}

/**
 * Crea una nueva entrada en la galería
 * @param {Object} datos - Datos de la imagen
 * @returns {number} ID de la imagen creada
 */
async function crearGaleria(datos) {
  try {
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id_artesano', sql.Int, datos.id_artesano)
      .input('nombre_archivo', sql.NVarChar, datos.nombre_archivo)
      .input('ruta_archivo', sql.NVarChar, datos.ruta_archivo)
      .input('descripcion', sql.NVarChar, datos.descripcion)
      .input('es_principal', sql.Bit, datos.es_principal)
      .query(`
        INSERT INTO GaleriaArtesano (id_artesano, nombre_archivo, ruta_archivo, descripcion, es_principal)
        VALUES (@id_artesano, @nombre_archivo, @ruta_archivo, @descripcion, @es_principal);
        SELECT SCOPE_IDENTITY() as id_galeria;
      `);
    
    return result.recordset[0].id_galeria;
  } catch (error) {
    console.error('Error en crearGaleria:', error);
    throw error;
  }
}

/**
 * Actualiza una entrada de la galería
 * @param {Object} datos - Datos a actualizar
 */
async function actualizarGaleria(datos) {
  try {
    console.log('=== ACTUALIZAR GALERÍA EN MODELO ===');
    console.log('Datos recibidos:', datos);
    
    const pool = await poolPromise;
    
    // Construir query dinámicamente según los campos que se van a actualizar
    let query = 'UPDATE GaleriaArtesano SET ';
    const inputs = [];
    
    // Agregar campos a actualizar
    if (datos.descripcion !== undefined) {
      query += 'descripcion = @descripcion, ';
      inputs.push({ name: 'descripcion', type: sql.NVarChar, value: datos.descripcion });
    }
    
    if (datos.nombre_archivo !== undefined) {
      query += 'nombre_archivo = @nombre_archivo, ';
      inputs.push({ name: 'nombre_archivo', type: sql.NVarChar, value: datos.nombre_archivo });
    }
    
    if (datos.ruta_archivo !== undefined) {
      query += 'ruta_archivo = @ruta_archivo, ';
      inputs.push({ name: 'ruta_archivo', type: sql.NVarChar, value: datos.ruta_archivo });
    }
    
    if (datos.es_principal !== undefined) {
      query += 'es_principal = @es_principal, ';
      inputs.push({ name: 'es_principal', type: sql.Bit, value: datos.es_principal });
    }
    
    // Remover la última coma y agregar WHERE
    query = query.slice(0, -2) + ' WHERE id_galeria = @id_galeria';
    inputs.push({ name: 'id_galeria', type: sql.Int, value: datos.id_galeria });
    
    console.log('Query a ejecutar:', query);
    console.log('Inputs:', inputs);
    
    // Construir request con inputs dinámicos
    const request = pool.request();
    inputs.forEach(input => {
      request.input(input.name, input.type, input.value);
    });
    
    await request.query(query);
    
    console.log('Galería actualizada correctamente en BD');
  } catch (error) {
    console.error('Error en actualizarGaleria:', error);
    throw error;
  }
}

/**
 * Elimina una entrada de la galería
 * @param {number} id_galeria
 */
async function eliminarGaleria(id_galeria) {
  try {
    const pool = await poolPromise;
    
    await pool.request()
      .input('id_galeria', sql.Int, id_galeria)
      .query('DELETE FROM GaleriaArtesano WHERE id_galeria = @id_galeria');
  } catch (error) {
    console.error('Error en eliminarGaleria:', error);
    throw error;
  }
}

/**
 * Establece una foto como principal
 * @param {number} id_galeria
 * @param {number} id_artesano
 */
async function establecerFotoPrincipal(id_galeria, id_artesano) {
  try {
    const pool = await poolPromise;
    
    // Primero quitar todas las fotos principales del artesano
    await pool.request()
      .input('id_artesano', sql.Int, id_artesano)
      .query('UPDATE GaleriaArtesano SET es_principal = 0 WHERE id_artesano = @id_artesano');
    
    // Luego establecer la foto específica como principal
    await pool.request()
      .input('id_galeria', sql.Int, id_galeria)
      .query('UPDATE GaleriaArtesano SET es_principal = 1 WHERE id_galeria = @id_galeria');
  } catch (error) {
    console.error('Error en establecerFotoPrincipal:', error);
    throw error;
  }
}

module.exports = {
  obtenerGaleriaPorArtesano,
  obtenerTodaGaleria,
  obtenerGaleriaPorId,
  contarFotosPorArtesano,
  crearGaleria,
  actualizarGaleria,
  eliminarGaleria,
  establecerFotoPrincipal
}; 