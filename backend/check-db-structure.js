// backend/check-db-structure.js
const { poolPromise, sql } = require('./db');

async function checkDatabaseStructure() {
  try {
    console.log('=== VERIFICANDO ESTRUCTURA DE BASE DE DATOS ===');
    
    const pool = await poolPromise;
    
    // Verificar si la tabla Usuario existe
    console.log('\n1. Verificando tabla Usuario...');
    const tableCheck = await pool.request()
      .query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'Usuario'
      `);
    
    if (tableCheck.recordset.length === 0) {
      console.log('❌ La tabla Usuario NO existe');
      return;
    }
    console.log('✅ La tabla Usuario existe');
    
    // Verificar columnas de la tabla Usuario
    console.log('\n2. Verificando columnas de la tabla Usuario...');
    const columnsCheck = await pool.request()
      .query(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Usuario'
        ORDER BY ORDINAL_POSITION
      `);
    
    console.log('Columnas de Usuario:');
    columnsCheck.recordset.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}, NULL: ${col.IS_NULLABLE})`);
    });
    
    // Verificar tabla Perfil
    console.log('\n3. Verificando tabla Perfil...');
    const perfilTableCheck = await pool.request()
      .query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'Perfil'
      `);
    
    if (perfilTableCheck.recordset.length === 0) {
      console.log('❌ La tabla Perfil NO existe');
    } else {
      console.log('✅ La tabla Perfil existe');
      
      // Verificar columnas de Perfil
      const perfilColumns = await pool.request()
        .query(`
          SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = 'Perfil'
          ORDER BY ORDINAL_POSITION
        `);
      
      console.log('Columnas de Perfil:');
      perfilColumns.recordset.forEach(col => {
        console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}, NULL: ${col.IS_NULLABLE})`);
      });
      
      // Verificar si el campo foto existe en Perfil
      const fotoExists = perfilColumns.recordset.some(col => col.COLUMN_NAME === 'foto');
      if (!fotoExists) {
        console.log('\n❌ El campo "foto" NO existe en la tabla Perfil');
        console.log('Necesitas agregar el campo foto a la tabla Perfil');
        console.log('\nScript SQL para agregar el campo:');
        console.log('ALTER TABLE Perfil ADD foto NVARCHAR(255) NULL;');
      } else {
        console.log('\n✅ El campo "foto" existe en la tabla Perfil');
      }
    }
    
    // Verificar tabla Artesano
    console.log('\n4. Verificando tabla Artesano...');
    const artesanoTableCheck = await pool.request()
      .query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'Artesano'
      `);
    
    if (artesanoTableCheck.recordset.length === 0) {
      console.log('❌ La tabla Artesano NO existe');
    } else {
      console.log('✅ La tabla Artesano existe');
      
      // Verificar columnas de Artesano
      const artesanoColumns = await pool.request()
        .query(`
          SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = 'Artesano'
          ORDER BY ORDINAL_POSITION
        `);
      
      console.log('Columnas de Artesano:');
      artesanoColumns.recordset.forEach(col => {
        console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}, NULL: ${col.IS_NULLABLE})`);
      });
    }
    
    // Verificar algunos registros de ejemplo
    console.log('\n5. Verificando registros de ejemplo...');
    const sampleUsers = await pool.request()
      .query('SELECT TOP 3 u.id_usuario, u.nombre, u.apellido, u.rol, p.foto FROM Usuario u LEFT JOIN Perfil p ON u.id_usuario = p.id_usuario');
    
    console.log('Usuarios de ejemplo:');
    sampleUsers.recordset.forEach(user => {
      console.log(`  - ID: ${user.id_usuario}, Nombre: ${user.nombre} ${user.apellido}, Rol: ${user.rol}, Foto: ${user.foto || 'NULL'}`);
    });
    
  } catch (error) {
    console.error('Error al verificar estructura de BD:', error);
  } finally {
    process.exit(0);
  }
}

checkDatabaseStructure(); 