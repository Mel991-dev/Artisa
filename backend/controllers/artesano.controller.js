// backend/controllers/artesano.controller.js
// Controlador para la gestión de perfiles de artesano
// Recibe las peticiones de la API, valida datos y llama a los modelos

const artesanoModel = require('../models/artesano.model');

/**
 * Controlador para crear un perfil de artesano
 * Llama al modelo para guardar los datos en la base de datos
 */
async function crearPerfil(req, res) {
  try {
    // Extrae los datos del cuerpo de la petición
    const datos = req.body;
    // Llama al modelo para crear el perfil
    await artesanoModel.crearPerfilArtesano(datos);
    res.status(201).json({ msg: 'Perfil de artesano creado correctamente.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear el perfil de artesano', error: err.message });
  }
}

/**
 * Controlador para actualizar el perfil de un artesano
 */
async function actualizarPerfil(req, res) {
  try {
    const datos = req.body;
    await artesanoModel.actualizarPerfilArtesano(datos);
    res.json({ msg: 'Perfil de artesano actualizado correctamente.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar el perfil de artesano', error: err.message });
  }
}

/**
 * Controlador para obtener el perfil de un artesano
 */
async function obtenerPerfil(req, res) {
  try {
    const id_usuario = parseInt(req.params.id_usuario);
    const perfil = await artesanoModel.obtenerPerfilArtesano(id_usuario);
    res.json(perfil);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener el perfil de artesano', error: err.message });
  }
}

module.exports = {
  crearPerfil,
  actualizarPerfil,
  obtenerPerfil
}; 