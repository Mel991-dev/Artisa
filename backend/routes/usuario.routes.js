// backend/routes/usuario.routes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const auth = require('../middleware/auth');

// Obtener perfil del usuario autenticado
router.get('/perfil', auth, usuarioController.obtenerPerfil);

// Actualizar perfil del usuario autenticado (con subida de archivos)
router.put('/perfil', auth, usuarioController.uploadMiddleware, usuarioController.actualizarPerfil);

// Obtener perfil público de un usuario (ruta específica)
router.get('/perfil-publico/:id_usuario', usuarioController.obtenerPerfilPublico);

module.exports = router; 