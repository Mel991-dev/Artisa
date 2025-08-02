// backend/controllers/admin.controller.js
const sql = require('mssql');
const { poolPromise } = require('../db');

// Obtener todos los usuarios con información básica
async function obtenerTodosUsuarios(req, res) {
  try {
    console.log('=== OBTENER TODOS LOS USUARIOS ===');
    
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT 
          u.id_usuario,
          u.nombre,
          u.apellido,
          u.correo,
          u.identificacion,
          u.direccion,
          u.pais,
          u.rol,
          p.foto as foto_perfil
        FROM Usuario u
        LEFT JOIN Perfil p ON u.id_usuario = p.id_usuario
        ORDER BY u.id_usuario DESC
      `);
    
    console.log('Usuarios encontrados:', result.recordset.length);
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ msg: 'Error al obtener usuarios', error: error.message });
  }
}

// Obtener un usuario específico con información básica
async function obtenerUsuario(req, res) {
  try {
    const { id_usuario } = req.params;
    console.log('=== OBTENER USUARIO ===');
    console.log('ID Usuario:', id_usuario);
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        SELECT 
          u.id_usuario,
          u.nombre,
          u.apellido,
          u.correo,
          u.identificacion,
          u.direccion,
          u.pais,
          u.rol,
          p.foto as foto_perfil
        FROM Usuario u
        LEFT JOIN Perfil p ON u.id_usuario = p.id_usuario
        WHERE u.id_usuario = @id_usuario
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    console.log('Usuario encontrado:', result.recordset[0]);
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ msg: 'Error al obtener usuario', error: error.message });
  }
}

// Obtener información completa de un artesano
async function obtenerArtesanoCompleto(req, res) {
  try {
    const { id_usuario } = req.params;
    console.log('=== OBTENER ARTESANO COMPLETO ===');
    console.log('ID Usuario:', id_usuario);
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        SELECT 
          u.id_usuario,
          u.nombre,
          u.apellido,
          u.correo,
          u.identificacion,
          u.direccion,
          u.pais,
          u.rol,
          p.foto as foto_perfil,
          a.especialidad,
          a.biografia,
          a.historia
        FROM Usuario u
        LEFT JOIN Perfil p ON u.id_usuario = p.id_usuario
        INNER JOIN Artesano a ON u.id_usuario = a.id_usuario
        WHERE u.id_usuario = @id_usuario
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: 'Artesano no encontrado' });
    }
    
    console.log('Artesano encontrado:', result.recordset[0]);
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al obtener artesano:', error);
    res.status(500).json({ msg: 'Error al obtener artesano', error: error.message });
  }
}

// Actualizar usuario
async function actualizarUsuario(req, res) {
  try {
    const { id_usuario } = req.params;
    const { nombre, apellido, correo, identificacion, direccion, pais, rol, especialidad, biografia, historia } = req.body;
    const archivo = req.file; // Nueva foto si se subió
    
    console.log('=== ACTUALIZAR USUARIO ===');
    console.log('ID Usuario:', id_usuario);
    console.log('Datos a actualizar:', { nombre, apellido, correo, identificacion, direccion, pais, rol, especialidad, biografia, historia });
    console.log('Archivo recibido:', archivo ? 'Sí' : 'No');
    
    const pool = await poolPromise;
    
    // Verificar si el usuario existe
    const userCheck = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('SELECT rol FROM Usuario WHERE id_usuario = @id_usuario');
    
    if (userCheck.recordset.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    const rolAnterior = userCheck.recordset[0].rol;
    console.log('Rol anterior:', rolAnterior, 'Nuevo rol:', rol);
    
    // Actualizar datos básicos del usuario
    const updateResult = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('nombre', sql.NVarChar, nombre)
      .input('apellido', sql.NVarChar, apellido)
      .input('correo', sql.NVarChar, correo)
      .input('identificacion', sql.NVarChar, identificacion)
      .input('direccion', sql.NVarChar, direccion)
      .input('pais', sql.NVarChar, pais)
      .input('rol', sql.NVarChar, rol)
      .query(`
        UPDATE Usuario 
        SET nombre = @nombre, apellido = @apellido, correo = @correo, 
            identificacion = @identificacion, direccion = @direccion, pais = @pais, rol = @rol
        WHERE id_usuario = @id_usuario
      `);
    
    console.log('Usuario actualizado, filas afectadas:', updateResult.rowsAffected);
    
    // Si se cambió de artesano a otro rol, eliminar datos de artesano
    if (rolAnterior === 'artesano' && rol !== 'artesano') {
      console.log('Eliminando datos de artesano...');
      const deleteResult = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .query('DELETE FROM Artesano WHERE id_usuario = @id_usuario');
      console.log('Datos de artesano eliminados, filas afectadas:', deleteResult.rowsAffected);
    }
    
    // Si se cambió a artesano, crear registro en tabla Artesano
    if (rol === 'artesano' && rolAnterior !== 'artesano') {
      console.log('Creando registro de artesano...');
      const insertResult = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .input('especialidad', sql.NVarChar, especialidad || '')
        .input('biografia', sql.NVarChar, biografia || '')
        .input('historia', sql.NVarChar, historia || '')
        .query(`
          INSERT INTO Artesano (id_usuario, especialidad, biografia, historia)
          VALUES (@id_usuario, @especialidad, @biografia, @historia)
        `);
      console.log('Registro de artesano creado, filas afectadas:', insertResult.rowsAffected);
    }
    
    // Si es artesano (ya sea que cambió o ya era), actualizar datos específicos
    if (rol === 'artesano') {
      console.log('Actualizando datos específicos de artesano...');
      console.log('Datos a actualizar:', { especialidad, biografia, historia });
      
      const updateArtesanoResult = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .input('especialidad', sql.NVarChar, especialidad || '')
        .input('biografia', sql.NVarChar, biografia || '')
        .input('historia', sql.NVarChar, historia || '')
        .query(`
          UPDATE Artesano 
          SET especialidad = @especialidad, biografia = @biografia, historia = @historia
          WHERE id_usuario = @id_usuario
        `);
      console.log('Datos de artesano actualizados, filas afectadas:', updateArtesanoResult.rowsAffected);
    }
    
    // Manejar foto de perfil si se subió una nueva
    if (archivo) {
      console.log('Procesando nueva foto de perfil...');
      // Verificar si ya existe un perfil
      const perfilCheck = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .query('SELECT foto FROM Perfil WHERE id_usuario = @id_usuario');
      
      if (perfilCheck.recordset.length > 0) {
        // Actualizar foto existente
        const updateFotoResult = await pool.request()
          .input('id_usuario', sql.Int, id_usuario)
          .input('foto', sql.NVarChar, archivo.filename)
          .query('UPDATE Perfil SET foto = @foto WHERE id_usuario = @id_usuario');
        console.log('Foto actualizada, filas afectadas:', updateFotoResult.rowsAffected);
      } else {
        // Crear nuevo perfil
        const insertFotoResult = await pool.request()
          .input('id_usuario', sql.Int, id_usuario)
          .input('foto', sql.NVarChar, archivo.filename)
          .query('INSERT INTO Perfil (id_usuario, foto) VALUES (@id_usuario, @foto)');
        console.log('Nuevo perfil creado con foto, filas afectadas:', insertFotoResult.rowsAffected);
      }
    }
    
    console.log('Usuario actualizado correctamente');
    res.json({ msg: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ msg: 'Error al actualizar usuario', error: error.message });
  }
}

// Actualizar artesano
async function actualizarArtesano(req, res) {
  try {
    const { id_usuario } = req.params;
    const { nombre, apellido, correo, direccion, pais, especialidad, biografia, historia } = req.body;
    const archivo = req.file; // Nueva foto si se subió
    
    console.log('=== ACTUALIZAR ARTESANO ===');
    console.log('ID Usuario:', id_usuario);
    console.log('Datos a actualizar:', { nombre, apellido, correo, direccion, pais, especialidad, biografia, historia });
    console.log('Archivo recibido:', archivo ? 'Sí' : 'No');
    
    const pool = await poolPromise;
    
    // Actualizar datos básicos del usuario
    await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('nombre', sql.NVarChar, nombre)
      .input('apellido', sql.NVarChar, apellido)
      .input('correo', sql.NVarChar, correo)
      .input('direccion', sql.NVarChar, direccion)
      .input('pais', sql.NVarChar, pais)
      .query(`
        UPDATE Usuario 
        SET nombre = @nombre, apellido = @apellido, correo = @correo, 
            direccion = @direccion, pais = @pais
        WHERE id_usuario = @id_usuario
      `);
    
    // Actualizar datos específicos del artesano
    await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('especialidad', sql.NVarChar, especialidad)
      .input('biografia', sql.NVarChar, biografia)
      .input('historia', sql.NVarChar, historia)
      .query(`
        UPDATE Artesano 
        SET especialidad = @especialidad, biografia = @biografia, historia = @historia
        WHERE id_usuario = @id_usuario
      `);
    
    // Manejar foto de perfil si se subió una nueva
    if (archivo) {
      // Verificar si ya existe un perfil
      const perfilCheck = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .query('SELECT foto FROM Perfil WHERE id_usuario = @id_usuario');
      
      if (perfilCheck.recordset.length > 0) {
        // Actualizar foto existente
        await pool.request()
          .input('id_usuario', sql.Int, id_usuario)
          .input('foto', sql.NVarChar, archivo.filename)
          .query('UPDATE Perfil SET foto = @foto WHERE id_usuario = @id_usuario');
      } else {
        // Crear nuevo perfil
        await pool.request()
          .input('id_usuario', sql.Int, id_usuario)
          .input('foto', sql.NVarChar, archivo.filename)
          .query('INSERT INTO Perfil (id_usuario, foto) VALUES (@id_usuario, @foto)');
      }
    }
    
    console.log('Artesano actualizado correctamente');
    res.json({ msg: 'Artesano actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar artesano:', error);
    res.status(500).json({ msg: 'Error al actualizar artesano', error: error.message });
  }
}

// Eliminar usuario
async function eliminarUsuario(req, res) {
  try {
    const { id_usuario } = req.params;
    
    console.log('=== ELIMINAR USUARIO ===');
    console.log('ID Usuario:', id_usuario);
    
    const pool = await poolPromise;
    
    // Primero verificar si es artesano para eliminar datos relacionados
    const userCheck = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('SELECT rol FROM Usuario WHERE id_usuario = @id_usuario');
    
    if (userCheck.recordset.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    const userRole = userCheck.recordset[0].rol;
    
    // Si es artesano, eliminar datos relacionados primero
    if (userRole === 'artesano') {
      // Eliminar productos del artesano
      await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .query('DELETE FROM Producto WHERE id_artesano = @id_usuario');
      
      // Eliminar galería del artesano
      await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .query('DELETE FROM GaleriaArtesano WHERE id_artesano = @id_usuario');
      
      // Eliminar datos del artesano
      await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .query('DELETE FROM Artesano WHERE id_usuario = @id_usuario');
    }
    
    // Eliminar perfil
    await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('DELETE FROM Perfil WHERE id_usuario = @id_usuario');
    
    // Finalmente eliminar el usuario
    await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('DELETE FROM Usuario WHERE id_usuario = @id_usuario');
    
    console.log('Usuario eliminado correctamente');
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ msg: 'Error al eliminar usuario', error: error.message });
  }
}

module.exports = {
  obtenerTodosUsuarios,
  obtenerUsuario,
  obtenerArtesanoCompleto,
  actualizarUsuario,
  actualizarArtesano,
  eliminarUsuario
}; 