// backend/controllers/detalleProducto.controller.js
const productoModel = require('../models/producto.model');
const artesanoModel = require('../models/artesano.model');
const db = require('../db');

// Modelo de resenas (puedes mejorar esto si tienes un modelo dedicado)
async function obtenerResenasPorProducto(id_producto) {
  const pool = await db.poolPromise;
  const result = await pool.request()
    .input('id_producto', db.sql.Int, id_producto)
    .query(`SELECT r.*, u.nombre as nombre_usuario FROM Resena r JOIN Usuario u ON r.id_usuario = u.id_usuario WHERE r.id_producto = @id_producto ORDER BY r.fecha DESC`);
  return result.recordset;
}

// Controlador para obtener todos los datos necesarios para la vista de producto
async function obtenerDetalleProducto(req, res) {
  try {
    const { id } = req.params;
    const producto = await productoModel.obtenerProductoPorId(id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado.' });

    // Obtener datos del artesano
    // 1. Datos de la tabla Artesano
    const pool = await db.poolPromise;
    const artesanoResult = await pool.request()
      .input('id_artesano', db.sql.Int, producto.id_artesano)
      .query('SELECT * FROM Artesano WHERE id_artesano = @id_artesano');
    const artesano = artesanoResult.recordset[0];
    // 2. Foto de perfil desde Perfil
    let foto_perfil = null;
    if (artesano && artesano.id_usuario) {
      const perfilResult = await pool.request()
        .input('id_usuario', db.sql.Int, artesano.id_usuario)
        .query('SELECT foto FROM Perfil WHERE id_usuario = @id_usuario');
      foto_perfil = perfilResult.recordset[0]?.foto || null;
    }
    // 3. Nombre del artesano desde Usuario
    let nombre_artesano = null;
    if (artesano && artesano.id_usuario) {
      const usuarioResult = await pool.request()
        .input('id_usuario', db.sql.Int, artesano.id_usuario)
        .query('SELECT nombre FROM Usuario WHERE id_usuario = @id_usuario');
      nombre_artesano = usuarioResult.recordset[0]?.nombre || null;
    }
    // 4. Unificar datos para frontend
    const artesanoFrontend = {
      id_artesano: artesano?.id_artesano,
      nombre: nombre_artesano,
      especialidad: artesano?.especialidad,
      biografia: artesano?.biografia,
      historia: artesano?.historia,
      foto_perfil
    };
    // Obtener reseñas
    const resenas = await obtenerResenasPorProducto(id);

    // Puedes agregar lógica para galería, promedio de calificación, etc.
    // Ejemplo de galería:
    producto.galeria = producto.galeria ? producto.galeria.split(',') : [];
    // Ejemplo de promedio:
    let promedio_calificacion = 0;
    if (resenas.length > 0) {
      promedio_calificacion = resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length;
    }
    producto.promedio_calificacion = promedio_calificacion;

    res.json({ producto, artesano: artesanoFrontend, resenas: resenas });
  } catch (err) {
    console.error('Error en obtenerDetalleProducto:', err);
    res.status(500).json({ msg: 'Error al obtener el detalle del producto', error: err.message });
  }
}

module.exports = {
  obtenerDetalleProducto
};
