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


/**
 * @route GET /api/resenas/producto/:id_producto
 * @desc Obtener todas las reseñas de un producto
 */
router.get('/producto/:id_producto', resenaController.getResenasPorProducto);


/**
 * @route PUT /api/resenas/:id_reseña
 * @desc Actualizar una reseña (solo usuarios autenticados)
 */
router.put('/:id_reseña', auth, resenaController.updateResena);

/**
 * @route DELETE /api/resenas/:id_reseña
 * @desc Eliminar una reseña (solo usuarios autenticados)
 */
router.delete('/:id_reseña', auth, resenaController.deleteResena);

module.exports = router;
