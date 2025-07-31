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
  },

  // Obtener artículos por usuario
  getByUsuario: async (id_usuario) => {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('id_usuario', id_usuario)
        .query(`
          SELECT bp.id_post, bp.id_usuario, bp.titulo, bp.contenido, bp.fecha_publicacion, bp.imagen_blog,
                 CONCAT(u.nombre, ' ', u.apellido) AS autor
          FROM BlogPost bp
          LEFT JOIN Usuario u ON bp.id_usuario = u.id_usuario
          WHERE bp.id_usuario = @id_usuario
          ORDER BY bp.fecha_publicacion DESC
        `);
      return result.recordset;
    } catch (err) {
      console.error('Error al obtener artículos por usuario:', err);
      throw err;
    }
  },

  // Actualizar artículo
  update: async (id_post, { titulo, contenido, imagen_blog }) => {
    try {
      const pool = await poolPromise;
      let query = `
        UPDATE BlogPost 
        SET titulo = @titulo, contenido = @contenido
      `;
      
      const inputs = [
        { name: 'id_post', value: id_post },
        { name: 'titulo', value: titulo },
        { name: 'contenido', value: contenido }
      ];

      // Agregar imagen si se proporciona
      if (imagen_blog) {
        query += `, imagen_blog = @imagen_blog`;
        inputs.push({ name: 'imagen_blog', value: imagen_blog });
      }

      query += ` WHERE id_post = @id_post`;

      const request = pool.request();
      inputs.forEach(input => {
        request.input(input.name, input.value);
      });

      await request.query(query);
    } catch (err) {
      console.error('Error al actualizar artículo:', err);
      throw err;
    }
  },

  // Eliminar artículo
  delete: async (id_post) => {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id_post', id_post)
        .query(`DELETE FROM BlogPost WHERE id_post = @id_post`);
    } catch (err) {
      console.error('Error al eliminar artículo:', err);
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
