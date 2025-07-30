
const { poolPromise } = require('../db'); // Conexión a la base de datos

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

  // Obtener todas las reseñas de un producto con el nombre del usuario
  getPorProducto: async (id_producto) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('id_producto', id_producto)
        .query(`
          SELECT r.id_reseña, r.comentario, r.calificacion, r.fecha,
                 CONCAT(u.nombre, ' ', u.apellido) AS nombre_usuario
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
};


// Actualizar una reseña
Resena.update = async (id_reseña, { comentario, calificacion }) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id_reseña', id_reseña)
      .input('comentario', comentario)
      .input('calificacion', calificacion)
      .query(`
        UPDATE Reseña
        SET comentario = @comentario, calificacion = @calificacion
        WHERE id_reseña = @id_reseña
      `);
  } catch (err) {
    console.error('Error al actualizar reseña:', err);
    throw err;
  }
};

// Eliminar una reseña
Resena.delete = async (id_reseña) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id_reseña', id_reseña)
      .query(`
        DELETE FROM Reseña WHERE id_reseña = @id_reseña
      `);
  } catch (err) {
    console.error('Error al eliminar reseña:', err);
    throw err;
  }
};

module.exports = Resena;
