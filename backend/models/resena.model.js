// Obtiene todas las reseñas de un producto con el nombre del usuario
async function getPorProducto(id_producto) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_producto', id_producto)
      .query(`
        SELECT r.id_reseña, r.comentario, r.calificacion, r.fecha, u.nombre AS nombre_usuario
        FROM Reseña r
        LEFT JOIN Usuario u ON r.id_usuario = u.id_usuario
        WHERE r.id_producto = @id_producto
        ORDER BY r.fecha DESC
      `);
    return result.recordset;
  } catch (error) {
    console.error('Error en getPorProducto:', error);
    throw error;
  }
}

module.exports.getPorProducto = getPorProducto;
// Modelo de Resena para Artisa Marketplace
// Este archivo define la estructura de la entidad Resena y las funciones para interactuar con la base de datos SQL Server

const { poolPromise } = require('../db'); // Conexión a la base de datos

/**
 * Estructura de la resena:
 * - id_resena: int (PK)
 * - id_usuario: int (FK)
 * - id_producto: int (FK)
 * - comentario: string
 * - calificacion: int (1-5)
 * - fecha: datetime
 */

const Resena = {
  // Crear una nueva resena
  create: async ({ id_usuario, id_producto, comentario, calificacion }) => {
    try {
      const query = `INSERT INTO Reseña (id_usuario, id_producto, comentario, calificacion) VALUES (@id_usuario, @id_producto, @comentario, @calificacion)`;
        const pool = await poolPromise;
        await pool.request()
          .input('id_usuario', id_usuario)
          .input('id_producto', id_producto)
          .input('comentario', comentario)
          .input('calificacion', calificacion)
          .query(`
            INSERT INTO Reseña (id_usuario, id_producto, comentario, calificacion, fecha)
            VALUES (@id_usuario, @id_producto, @comentario, @calificacion, GETDATE())
          `);
    } catch (err) {
      console.error('Error en modelo Resena al insertar:', err);
      throw err;
    }
  },
  // ...puedes agregar más funciones como listar, obtener por producto, etc.
};

module.exports = Resena;
