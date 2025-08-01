// backend/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/admin');
const adminController = require('../controllers/admin.controller');
const uploadPerfil = require('../middleware/upload-perfil');

// Ruta para verificar si el usuario es administrador
router.get('/verify', isAdmin, (req, res) => {
    res.json({ 
        msg: 'Usuario verificado como administrador',
        user: req.user
    });
});

// Obtener todos los usuarios
router.get('/usuarios', isAdmin, adminController.obtenerTodosUsuarios);

// Obtener un usuario específico
router.get('/usuarios/:id_usuario', isAdmin, adminController.obtenerUsuario);

// Obtener información completa de un artesano
router.get('/artesanos/:id_usuario', isAdmin, adminController.obtenerArtesanoCompleto);

// Actualizar usuario
router.put('/usuarios/:id_usuario', isAdmin, uploadPerfil.single('foto'), adminController.actualizarUsuario);

// Actualizar artesano
router.put('/artesanos/:id_usuario', isAdmin, uploadPerfil.single('foto'), adminController.actualizarArtesano);

// Eliminar usuario
router.delete('/usuarios/:id_usuario', isAdmin, adminController.eliminarUsuario);

module.exports = router;
