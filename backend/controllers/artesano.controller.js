// backend/controllers/artesano.controller.js
// Controlador para la gestión de perfiles de artesano
// Recibe las peticiones de la API, valida datos y llama a los modelos

const artesanoModel = require('../models/artesano.model');
const { poolPromise, sql } = require('../db');

// Validación simple
function validarDatosArtesano(datos) {
  const errores = [];
  if (!datos.especialidad || datos.especialidad.length < 3) errores.push('La especialidad es obligatoria y debe tener al menos 3 caracteres.');
  if (!datos.biografia || datos.biografia.length < 10 || datos.biografia.length > 500)
    errores.push('La biografía debe tener entre 10 y 500 caracteres.');
  if (!datos.historia || datos.historia.length < 10 || datos.historia.length > 1000)
    errores.push('La historia debe tener entre 10 y 1000 caracteres.');
  // Puedes agregar más validaciones según tu modelo
  return errores;
}

async function crearPerfil(req, res) {
  try {
    const datos = req.body;
    const errores = validarDatosArtesano(datos);
    if (errores.length > 0) return res.status(400).json({ errores });
    await artesanoModel.crearPerfilArtesano(datos);
    res.status(201).json({ msg: 'Perfil de artesano creado correctamente.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear el perfil de artesano', error: err.message });
  }
}

async function actualizarPerfil(req, res) {
  try {
    const datos = req.body;
    const errores = validarDatosArtesano(datos);
    if (errores.length > 0) return res.status(400).json({ errores });
    await artesanoModel.actualizarPerfilArtesano(datos);
    res.json({ msg: 'Perfil de artesano actualizado correctamente.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar el perfil de artesano', error: err.message });
  }
}

async function obtenerPerfil(req, res) {
  try {
    const id_usuario = req.params.id_usuario;
    const perfil = await artesanoModel.obtenerPerfilArtesano(id_usuario);
    res.json(perfil);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener el perfil de artesano', error: err.message });
  }
}

async function obtenerPerfilPublico(req, res) {
  try {
    const id_usuario = req.params.id_usuario;
    const perfil = await artesanoModel.obtenerPerfilArtesano(id_usuario);
    if (!perfil) return res.status(404).json({ msg: 'Perfil no encontrado' });

    // Solo campos públicos
    const perfilPublico = {
      especialidad: perfil.especialidad,
      biografia: perfil.biografia,
      historia: perfil.historia,
      foto: perfil.foto
      // Agrega aquí otros campos públicos si los tienes
    };

    res.json(perfilPublico);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener el perfil público', error: err.message });
  }
}

module.exports = {
  crearPerfil,
  actualizarPerfil,
  obtenerPerfil,
  obtenerPerfilPublico
}; 