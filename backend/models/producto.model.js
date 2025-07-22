// backend/models/producto.model.js
const { poolPromise, sql } = require('../db');

/**
 * Crea un nuevo producto en la base de datos
 * @param {Object} datos - Datos del producto (nombre, descripcion, precio, stock, imagen, id_categoria, id_artesano)
 */
async function crearProducto(datos) {
  const pool = await poolPromise;
  
  const result = await pool.request()
    .input('nombre', sql.NVarChar, datos.nombre)
    .input('descripcion', sql.NVarChar, datos.descripcion)
    .input('precio', sql.Decimal(10,2), datos.precio)
    .input('stock', sql.Int, datos.stock)
    .input('imagen', sql.NVarChar, datos.imagen)
    .input('id_categoria', sql.Int, datos.id_categoria)
    .input('id_artesano', sql.Int, datos.id_artesano)
    .query(`INSERT INTO Producto (nombre, descripcion, precio, stock, imagen, id_categoria, id_artesano)
            OUTPUT INSERTED.id_producto
            VALUES (@nombre, @descripcion, @precio, @stock, @imagen, @id_categoria, @id_artesano)`);
  
  return result.recordset[0].id_producto;
}

/**
 * Obtiene todos los productos de un artesano específico
 * @param {number} id_artesano - ID del artesano
 */
async function obtenerProductosPorArtesano(id_artesano) {
  const pool = await poolPromise;
  
  const result = await pool.request()
    .input('id_artesano', sql.Int, id_artesano)
    .query(`SELECT p.*, c.nombre as categoria_nombre 
            FROM Producto p 
            LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria 
            WHERE p.id_artesano = @id_artesano 
            ORDER BY p.id_producto DESC`);
  
  return result.recordset;
}

/**
 * Obtiene un producto específico por su ID
 * @param {number} id_producto - ID del producto
 */
async function obtenerProductoPorId(id_producto) {
  const pool = await poolPromise;
  
  const result = await pool.request()
    .input('id_producto', sql.Int, id_producto)
    .query(`SELECT p.*, c.nombre as categoria_nombre 
            FROM Producto p 
            LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria 
            WHERE p.id_producto = @id_producto`);
  
  return result.recordset[0];
}

/**
 * Actualiza un producto existente
 * @param {Object} datos - Datos del producto a actualizar
 */
async function actualizarProducto(datos) {
  const pool = await poolPromise;
  
  await pool.request()
    .input('id_producto', sql.Int, datos.id_producto)
    .input('nombre', sql.NVarChar, datos.nombre)
    .input('descripcion', sql.NVarChar, datos.descripcion)
    .input('precio', sql.Decimal(10,2), datos.precio)
    .input('stock', sql.Int, datos.stock)
    .input('imagen', sql.NVarChar, datos.imagen)
    .input('id_categoria', sql.Int, datos.id_categoria)
    .query(`UPDATE Producto 
            SET nombre = @nombre, descripcion = @descripcion, precio = @precio, 
                stock = @stock, imagen = @imagen, id_categoria = @id_categoria 
            WHERE id_producto = @id_producto`);
}

/**
 * Elimina un producto
 * @param {number} id_producto - ID del producto a eliminar
 */
async function eliminarProducto(id_producto) {
  const pool = await poolPromise;
  
  await pool.request()
    .input('id_producto', sql.Int, id_producto)
    .query('DELETE FROM Producto WHERE id_producto = @id_producto');
}

/**
 * Obtiene todas las categorías disponibles
 */
async function obtenerCategorias() {
  const pool = await poolPromise;
  
  const result = await pool.request()
    .query('SELECT * FROM Categoria ORDER BY nombre');
  
  return result.recordset;
}

module.exports = {
  crearProducto,
  obtenerProductosPorArtesano,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  obtenerCategorias
}; 