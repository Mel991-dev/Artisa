const BlogPost = require('../models/blogpost.model');

// Crear un nuevo artículo
exports.createArticulo = async (req, res) => {
  try {
    const { id_usuario, titulo, contenido } = req.body;
    let imagen_blog = null;
    if (req.file) {
      imagen_blog = req.file.filename; // Asume que el middleware de subida guarda el nombre del archivo
    }
    await BlogPost.create({ id_usuario, titulo, contenido, imagen_blog });
    res.status(201).json({ msg: 'Artículo creado exitosamente.' });
  } catch (err) {
    console.error('Error en createArticulo:', err);
    res.status(500).json({ msg: 'Error al crear el artículo.' });
  }
};

// Obtener un artículo por su id
exports.getArticuloPorId = async (req, res) => {
  try {
    const { id_post } = req.params;
    const articulo = await BlogPost.getById(id_post);
    if (!articulo) {
      return res.status(404).json({ msg: 'Artículo no encontrado.' });
    }
    res.json(articulo);
  } catch (err) {
    console.error('Error en getArticuloPorId:', err);
    res.status(500).json({ msg: 'Error al obtener el artículo.' });
  }
};

// Obtener todos los artículos
exports.getArticulos = async (req, res) => {
  try {
    const articulos = await BlogPost.getAll();
    res.json(articulos);
  } catch (err) {
    console.error('Error en getArticulos:', err);
    res.status(500).json({ msg: 'Error al obtener los artículos.' });
  }
};

// Obtener artículos por usuario (para el dashboard)
exports.getArticulosPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const articulos = await BlogPost.getByUsuario(id_usuario);
    res.json(articulos);
  } catch (err) {
    console.error('Error en getArticulosPorUsuario:', err);
    res.status(500).json({ msg: 'Error al obtener los artículos del usuario.' });
  }
};

// Actualizar artículo
exports.updateArticulo = async (req, res) => {
  try {
    const { id_post } = req.params;
    const { titulo, contenido } = req.body;
    let imagen_blog = null;
    
    if (req.file) {
      imagen_blog = req.file.filename;
    }

    // Verificar que el artículo existe
    const articuloExistente = await BlogPost.getById(id_post);
    if (!articuloExistente) {
      return res.status(404).json({ msg: 'Artículo no encontrado.' });
    }

    await BlogPost.update(id_post, { titulo, contenido, imagen_blog });
    res.json({ msg: 'Artículo actualizado exitosamente.' });
  } catch (err) {
    console.error('Error en updateArticulo:', err);
    res.status(500).json({ msg: 'Error al actualizar el artículo.' });
  }
};

// Eliminar artículo
exports.deleteArticulo = async (req, res) => {
  try {
    const { id_post } = req.params;
    
    // Verificar que el artículo existe
    const articuloExistente = await BlogPost.getById(id_post);
    if (!articuloExistente) {
      return res.status(404).json({ msg: 'Artículo no encontrado.' });
    }

    await BlogPost.delete(id_post);
    res.json({ msg: 'Artículo eliminado exitosamente.' });
  } catch (err) {
    console.error('Error en deleteArticulo:', err);
    res.status(500).json({ msg: 'Error al eliminar el artículo.' });
  }
};
