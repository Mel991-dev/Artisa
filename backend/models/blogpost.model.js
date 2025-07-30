const { poolPromise } = require('../db');

const BlogPost = {
  // Crear un nuevo artículo
  create: async ({ id_usuario, titulo, contenido, imagen_blog }) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id_usuario', id_usuario)
        .input('titulo', titulo)
        .input('contenido', contenido)
        .input('imagen_blog', imagen_blog)
        .query(`
          INSERT INTO BlogPost (id_usuario, titulo, contenido, fecha_publicacion, imagen_blog)
          VALUES (@id_usuario, @titulo, @contenido, GETDATE(), @imagen_blog)
        `);
    } catch (err) {
      console.error('Error al crear artículo:', err);
      throw err;
    }
  },

  // Obtener todos los artículos
  getAll: async () => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query(`
          SELECT bp.id_post, bp.id_usuario, bp.titulo, bp.contenido, bp.fecha_publicacion, bp.imagen_blog,
                 CONCAT(u.nombre, ' ', u.apellido) AS autor
          FROM BlogPost bp
          LEFT JOIN Usuario u ON bp.id_usuario = u.id_usuario
          ORDER BY bp.fecha_publicacion DESC
        `);
      return result.recordset;
    } catch (err) {
      console.error('Error al obtener artículos:', err);
      throw err;
    }
  }
};

// Obtener un artículo por su id
BlogPost.getById = async (id_post) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_post', id_post)
      .query(`
        SELECT bp.id_post, bp.id_usuario, bp.titulo, bp.contenido, bp.fecha_publicacion, bp.imagen_blog,
               CONCAT(u.nombre, ' ', u.apellido) AS autor
        FROM BlogPost bp
        LEFT JOIN Usuario u ON bp.id_usuario = u.id_usuario
        WHERE bp.id_post = @id_post
      `);
    return result.recordset[0];
  } catch (err) {
    console.error('Error al obtener artículo por id:', err);
    throw err;
  }
};

module.exports = BlogPost;
