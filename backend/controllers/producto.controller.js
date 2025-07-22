// backend/controllers/producto.controller.js
const productoModel = require('../models/producto.model');
const { poolPromise, sql } = require('../db');
const fs = require('fs');
const path = require('path');

// Validación de datos del producto
function validarDatosProducto(datos) {
  const errores = [];
  
  if (!datos.nombre || datos.nombre.length < 3) {
    errores.push('El nombre del producto es obligatorio y debe tener al menos 3 caracteres.');
  }
  
  if (!datos.descripcion || datos.descripcion.length < 10) {
    errores.push('La descripción es obligatoria y debe tener al menos 10 caracteres.');
  }
  
  if (!datos.precio || datos.precio <= 0) {
    errores.push('El precio es obligatorio y debe ser mayor a 0.');
  }
  
  if (datos.stock === undefined || datos.stock < 0) {
    errores.push('El stock es obligatorio y no puede ser negativo.');
  }
  
  if (!datos.id_categoria) {
    errores.push('La categoría es obligatoria.');
  }
  
  return errores;
}

// Crear un nuevo producto
async function crearProducto(req, res) {
  try {
    console.log('=== INICIO CREAR PRODUCTO ===');
    console.log('Body recibido:', req.body);
    console.log('Archivo recibido:', req.file);
    
    const datos = req.body;
    const errores = validarDatosProducto(datos);
    
    if (errores.length > 0) {
      console.log('Errores de validación:', errores);
      return res.status(400).json({ errores });
    }

    // Obtener el id_artesano del usuario autenticado (por ahora lo pasamos en el body)
    const id_artesano = datos.id_artesano;
    if (!id_artesano) {
      console.log('Error: ID de artesano no encontrado');
      return res.status(400).json({ msg: 'ID de artesano es requerido.' });
    }

    // Procesar imagen si se subió
    let rutaImagen = null;
    if (req.file) {
      rutaImagen = `/uploads/productos/${req.file.filename}`;
      console.log('Imagen procesada:', rutaImagen);
    } else {
      console.log('No se subió imagen');
    }

    const datosProducto = {
      ...datos,
      id_artesano,
      imagen: rutaImagen
    };
    
    console.log('Datos a insertar en BD:', datosProducto);

    const id_producto = await productoModel.crearProducto(datosProducto);
    console.log('Producto creado con ID:', id_producto);

    res.status(201).json({ 
      msg: 'Producto creado correctamente.',
      id_producto,
      imagen: rutaImagen
    });
    
    console.log('=== FIN CREAR PRODUCTO ===');
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ msg: 'Error al crear el producto', error: err.message });
  }
}

// Obtener productos de un artesano
async function obtenerProductosPorArtesano(req, res) {
  try {
    const { id_artesano } = req.params;
    const productos = await productoModel.obtenerProductosPorArtesano(id_artesano);
    res.json(productos);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ msg: 'Error al obtener los productos', error: err.message });
  }
}

/**
 * Obtiene todos los productos de un artesano específico
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function obtenerProductosArtesano(req, res) {
  try {
    console.log('=== OBTENER PRODUCTOS ARTESANO ===');
    const { id_artesano } = req.params;
    console.log('ID Artesano:', id_artesano);

    const productos = await productoModel.obtenerProductosPorArtesano(id_artesano);
    console.log('Productos obtenidos:', productos);

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos del artesano:', error);
    res.status(500).json({ 
      msg: 'Error al obtener los productos del artesano', 
      error: error.message 
    });
  }
}

// Obtener un producto específico
async function obtenerProductoPorId(req, res) {
  try {
    const { id_producto } = req.params;
    const producto = await productoModel.obtenerProductoPorId(id_producto);
    
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado.' });
    }
    
    res.json(producto);
  } catch (err) {
    console.error('Error al obtener producto:', err);
    res.status(500).json({ msg: 'Error al obtener el producto', error: err.message });
  }
}

// Actualizar un producto
async function actualizarProducto(req, res) {
  try {
    console.log('=== INICIO ACTUALIZAR PRODUCTO ===');
    console.log('Params recibidos:', req.params);
    console.log('Body recibido:', req.body);
    console.log('Archivo recibido:', req.file);
    
    const { id_producto } = req.params;
    console.log('ID del producto a actualizar:', id_producto);
    console.log('Tipo de ID:', typeof id_producto);
    
    const datos = req.body;
    const errores = validarDatosProducto(datos);
    
    if (errores.length > 0) {
      console.log('Errores de validación:', errores);
      return res.status(400).json({ errores });
    }

    // Verificar que el producto existe
    console.log('Buscando producto con ID:', id_producto);
    const productoExistente = await productoModel.obtenerProductoPorId(id_producto);
    console.log('Producto encontrado:', productoExistente);
    
    if (!productoExistente) {
      console.log('Error: Producto no encontrado');
      return res.status(404).json({ msg: 'Producto no encontrado.' });
    }

    // Procesar imagen si se subió una nueva
    let rutaImagen = productoExistente.imagen; // Mantener imagen actual por defecto
    if (req.file) {
      rutaImagen = `/uploads/productos/${req.file.filename}`;
      console.log('Nueva imagen procesada:', rutaImagen);
    } else {
      console.log('No se subió nueva imagen, manteniendo la actual:', rutaImagen);
    }

    const datosActualizados = {
      id_producto: parseInt(id_producto),
      ...datos,
      imagen: rutaImagen
    };
    
    console.log('Datos a actualizar en BD:', datosActualizados);

    await productoModel.actualizarProducto(datosActualizados);
    console.log('Producto actualizado correctamente');

    res.json({ 
      msg: 'Producto actualizado correctamente.',
      imagen: rutaImagen
    });
    
    console.log('=== FIN ACTUALIZAR PRODUCTO ===');
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(500).json({ msg: 'Error al actualizar el producto', error: err.message });
  }
}

// Eliminar un producto
async function eliminarProducto(req, res) {
  try {
    const { id_producto } = req.params;
    
    // Verificar que el producto existe
    const productoExistente = await productoModel.obtenerProductoPorId(id_producto);
    if (!productoExistente) {
      return res.status(404).json({ msg: 'Producto no encontrado.' });
    }

    await productoModel.eliminarProducto(id_producto);
    res.json({ msg: 'Producto eliminado correctamente.' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ msg: 'Error al eliminar el producto', error: err.message });
  }
}

// Obtener todas las categorías
async function obtenerCategorias(req, res) {
  try {
    const categorias = await productoModel.obtenerCategorias();
    res.json(categorias);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ msg: 'Error al obtener las categorías', error: err.message });
  }
}

module.exports = {
  crearProducto,
  obtenerProductosPorArtesano,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  obtenerCategorias
}; 