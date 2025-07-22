// backend/routes/galeria.routes.js
const express = require('express');
const router = express.Router();
const galeriaController = require('../controllers/galeria.controller');
const verificarToken = require('../middleware/auth');

// Rutas públicas (DEBEN IR PRIMERO)
router.get('/artesano/:id_artesano', galeriaController.obtenerGaleriaArtesano);

// Rutas protegidas (requieren autenticación)
router.get('/', verificarToken, galeriaController.obtenerTodaGaleria);
router.post('/', verificarToken, galeriaController.crearGaleria);
router.post('/:id_galeria/principal', verificarToken, galeriaController.establecerFotoPrincipal);
router.get('/:id_galeria', verificarToken, galeriaController.obtenerGaleriaPorId);
router.put('/:id_galeria', verificarToken, galeriaController.actualizarGaleria);
router.delete('/:id_galeria', verificarToken, galeriaController.eliminarGaleria);

module.exports = router; 