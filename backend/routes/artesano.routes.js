// backend/routes/artesano.routes.js
// Rutas para la gestión de perfiles de artesano

const express = require('express');
const router = express.Router();
const artesanoController = require('../controllers/artesano.controller');
const auth = require('../middleware/auth'); // Middleware de autenticación (debe existir)
const checkRole = require('../middleware/roles'); // Middleware de roles (debe existir)

// Ruta para crear un perfil de artesano
// Solo accesible para usuarios autenticados con rol 'artesano'
router.post('/', auth, checkRole(['artesano']), artesanoController.crearPerfil);

// Ruta para actualizar el perfil de un artesano
// Solo accesible para usuarios autenticados con rol 'artesano'
router.put('/', auth, checkRole(['artesano']), artesanoController.actualizarPerfil);

// Ruta para obtener el perfil de un artesano por su id_usuario
// Accesible para cualquier usuario autenticado
router.get('/:id_usuario', auth, artesanoController.obtenerPerfil);
router.get('/publico/:id_usuario', artesanoController.obtenerPerfilPublico);

module.exports = router; 