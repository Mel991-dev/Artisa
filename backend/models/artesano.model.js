// backend/models/artesano.model.js
// Modelo de datos para la entidad Artesano y su perfil
// Aquí se definen las funciones que interactúan con la base de datos SQL Server

const sql = require('mssql');

/**
 * Crea un nuevo perfil de artesano en la base de datos
 * @param {Object} datos - Datos del perfil (id_usuario, especialidad, biografia, historia, foto)
 */
async function crearPerfilArtesano(datos) {
  const pool = await sql.connect();
  // Inserta en la tabla Artesano y Perfil
  await pool.request()
    .input('id_usuario', sql.Int, datos.id_usuario)
    .input('especialidad', sql.NVarChar, datos.especialidad)
    .query('INSERT INTO Artesano (id_artesano, especialidad) VALUES (@id_usuario, @especialidad)');
  await pool.request()
    .input('id_usuario', sql.Int, datos.id_usuario)
    .input('biografia', sql.NVarChar, datos.biografia)
    .input('historia', sql.NVarChar, datos.historia)
    .input('foto', sql.NVarChar, datos.foto)
    .query('INSERT INTO Perfil (id_usuario, biografia, historia, foto) VALUES (@id_usuario, @biografia, @historia, @foto)');
}

/**
 * Actualiza el perfil de un artesano
 * @param {Object} datos - Datos a actualizar (id_usuario, especialidad, biografia, historia, foto)
 */
async function actualizarPerfilArtesano(datos) {
  const pool = await sql.connect();
  await pool.request()
    .input('id_usuario', sql.Int, datos.id_usuario)
    .input('especialidad', sql.NVarChar, datos.especialidad)
    .query('UPDATE Artesano SET especialidad = @especialidad WHERE id_artesano = @id_usuario');
  await pool.request()
    .input('id_usuario', sql.Int, datos.id_usuario)
    .input('biografia', sql.NVarChar, datos.biografia)
    .input('historia', sql.NVarChar, datos.historia)
    .input('foto', sql.NVarChar, datos.foto)
    .query('UPDATE Perfil SET biografia = @biografia, historia = @historia, foto = @foto WHERE id_usuario = @id_usuario');
}

/**
 * Obtiene el perfil de un artesano por su id de usuario
 * @param {number} id_usuario
 * @returns {Object} Perfil del artesano
 */
async function obtenerPerfilArtesano(id_usuario) {
  const pool = await sql.connect();
  const perfil = await pool.request()
    .input('id_usuario', sql.Int, id_usuario)
    .query('SELECT a.especialidad, p.biografia, p.historia, p.foto FROM Artesano a JOIN Perfil p ON a.id_artesano = p.id_usuario WHERE a.id_artesano = @id_usuario');
  return perfil.recordset[0];
}

module.exports = {
  crearPerfilArtesano,
  actualizarPerfilArtesano,
  obtenerPerfilArtesano
}; 