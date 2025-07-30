/**
 * GET /api/resenas/producto/:id_producto
 * Obtiene todas las reseñas de un producto con el nombre del usuario
 */
exports.getResenasPorProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const resenas = await Resena.getPorProducto(id_producto);
    res.json(resenas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las reseñas.' });
  }
};
// Controlador de Resenas para Artisa Marketplace
// Este archivo contiene la lógica para crear resenas y validaciones de negocio

const Resena = require('../models/resena.model');
const db = require('../db');

/**
 * POST /api/resenas
 * Crea una nueva resena si el usuario es comprador y ha comprado el producto
 */
exports.createResena = async (req, res) => {
  try {
    const { id_producto, comentario, calificacion } = req.body;
   const id_usuario = req.user?.id_usuario;

    // (Eliminada validación de compra: cualquier usuario puede dejar reseña)

    // Validar calificación
    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5.' });
    }

    // Crear la resena
    await Resena.create({ id_usuario, id_producto, comentario, calificacion });
    res.status(201).json({ message: 'Resena creada exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la resena.' });
  }
};

/**
 * PUT /api/resenas/:id_reseña
 * Actualiza una reseña existente
 */
exports.updateResena = async (req, res) => {
  try {
    const { id_reseña } = req.params;
    const { comentario, calificacion } = req.body;
    if (calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5.' });
    }
    await Resena.update(id_reseña, { comentario, calificacion });
    res.json({ message: 'Resena actualizada exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la resena.' });
  }
};

/**
 * DELETE /api/resenas/:id_reseña
 * Elimina una reseña existente
 */
exports.deleteResena = async (req, res) => {
  try {
    const { id_reseña } = req.params;
    await Resena.delete(id_reseña);
    res.json({ message: 'Resena eliminada exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la resena.' });
  }
};
