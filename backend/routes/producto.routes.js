// backend/routes/producto.routes.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const detalleProductoController = require('../controllers/detalleProducto.controller');
// Ruta para obtener el detalle completo del producto (producto, artesano, resenas)
router.get('/detalle/:id', detalleProductoController.obtenerDetalleProducto);
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Ruta para obtener todas las categorías (pública) - DEBE IR PRIMERO
router.get('/categorias', productoController.obtenerCategorias);

// Endpoint para listar todos los productos con filtros
router.get('/', productoController.listarProductos);

// Ruta para obtener productos de un artesano específico
router.get('/artesano/:id_artesano', productoController.obtenerProductosPorArtesano);

// Rutas protegidas (requieren autenticación)
router.post('/', upload.single('imagen'), productoController.crearProducto);
router.get('/:id_producto', productoController.obtenerProductoPorId);
router.put('/:id_producto', upload.single('imagen'), productoController.actualizarProducto);
router.delete('/:id_producto', productoController.eliminarProducto);

module.exports = router; 