// Script para verificar productos en la base de datos
const { poolPromise } = require('./db');

async function verificarProductos() {
  try {
    const pool = await poolPromise;
    
    console.log('=== VERIFICANDO PRODUCTOS ===');
    
    // Verificar productos del artesano 1
    const result = await pool.request()
      .input('id_artesano', require('mssql').Int, 1)
      .query(`SELECT p.*, c.nombre as categoria_nombre 
              FROM Producto p 
              LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria 
              WHERE p.id_artesano = @id_artesano 
              ORDER BY p.id_producto DESC`);
    
    console.log('Productos encontrados:', result.recordset.length);
    console.log('Productos:', result.recordset);
    
    // Verificar todas las categorías
    const categorias = await pool.request()
      .query('SELECT * FROM Categoria ORDER BY nombre');
    
    console.log('Categorías disponibles:', categorias.recordset);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

verificarProductos(); 