// Rutas para la API de Resenas en Artisa Marketplace
// Este archivo define los endpoints REST relacionados con resenas

const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resena.controller');
const auth = require('../middleware/auth'); // Middleware de autenticación

/**
 * @route POST /api/resenas
 * @desc Crear una nueva resena (solo usuarios autenticados)
 */
router.post('/', auth, resenaController.createResena);

// ...puedes agregar más rutas como GET para listar resenas por producto

module.exports = router;
