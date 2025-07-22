// backend/scripts/init-categorias.js
const { poolPromise } = require('../db');
const sql = require('mssql');

async function inicializarCategorias() {
  const pool = await poolPromise;
  
  const categorias = [
    'Joyeria', 'Cerámica', 'Textiles', 'Madera', 
    'Cuero', 'Metal', 'Vidrio', 'Papel', 'Piedra', 'Otros'
  ];
  
  for (const categoria of categorias) {
    try {
      await pool.request()
        .input('nombre', sql.NVarChar, categoria)
        .query('INSERT INTO Categoria (nombre) VALUES (@nombre)');
    } catch (err) {
      // Si ya existe, no hacer nada
      console.log(`Categoría ${categoria} ya existe o hubo un error:`, err.message);
    }
  }
  
  console.log('✅ Categorías inicializadas correctamente');
}

module.exports = { inicializarCategorias };
