// backend/models/usuario.model.js
const { poolPromise, sql } = require('../db');
const bcrypt = require('bcryptjs');

/**
 * Obtiene el perfil completo de un usuario (incluyendo datos de artesano si aplica)
 * @param {number} id_usuario
 * @returns {Object} Perfil completo del usuario
 */
async function obtenerPerfilCompleto(id_usuario) {
  try {
    console.log('=== OBTENER PERFIL COMPLETO ===');
    console.log('ID usuario:', id_usuario);
    
    const pool = await poolPromise;
    
    // Obtener datos básicos del usuario y foto del perfil
    const usuario = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.direccion, u.pais, u.rol, p.foto 
        FROM Usuario u 
        LEFT JOIN Perfil p ON u.id_usuario = p.id_usuario 
        WHERE u.id_usuario = @id_usuario
      `);
    
    console.log('Consulta usuario ejecutada');
    console.log('Registros encontrados:', usuario.recordset.length);
    
    if (usuario.recordset.length === 0) {
      console.log('No se encontró usuario con ID:', id_usuario);
      return null;
    }
    
    const datosUsuario = usuario.recordset[0];
    console.log('Datos básicos del usuario:', datosUsuario);
    
    // Si es artesano, obtener datos adicionales
    if (datosUsuario.rol === 'artesano') {
      console.log('Usuario es artesano, obteniendo datos adicionales');
      const artesano = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .query('SELECT especialidad, biografia, historia FROM Artesano WHERE id_usuario = @id_usuario');
      
      console.log('Consulta artesano ejecutada');
      console.log('Registros artesano encontrados:', artesano.recordset.length);
      
      if (artesano.recordset.length > 0) {
        const resultado = {
          ...datosUsuario,
          ...artesano.recordset[0]
        };
        console.log('Perfil completo (con datos de artesano):', resultado);
        return resultado;
      }
    }
    
    console.log('Perfil básico (sin datos de artesano):', datosUsuario);
    return datosUsuario;
  } catch (error) {
    console.error('Error en obtenerPerfilCompleto:', error);
    throw error;
  }
}

/**
 * Actualiza el perfil completo de un usuario
 * @param {number} id_usuario
 * @param {Object} datos - Datos a actualizar
 */
async function actualizarPerfilCompleto(id_usuario, datos) {
  try {
    console.log('=== ACTUALIZAR PERFIL COMPLETO ===');
    console.log('ID usuario:', id_usuario);
    console.log('Datos a actualizar:', datos);
    
    const pool = await poolPromise;
    
    // Preparar datos para actualización de usuario
    const datosUsuario = {
      nombre: datos.nombre,
      apellido: datos.apellido,
      correo: datos.correo,
      direccion: datos.direccion,
      pais: datos.pais
    };
    
    // Si se proporciona nueva contraseña, hashearla
    if (datos.contraseña) {
      console.log('Hasheando nueva contraseña');
      const salt = await bcrypt.genSalt(10);
      datosUsuario.contraseña = await bcrypt.hash(datos.contraseña, salt);
    }
    
    // Actualizar datos básicos del usuario
    let query = 'UPDATE Usuario SET nombre = @nombre, apellido = @apellido, correo = @correo, direccion = @direccion, pais = @pais';
    const request = pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('nombre', sql.NVarChar, datosUsuario.nombre)
      .input('apellido', sql.NVarChar, datosUsuario.apellido)
      .input('correo', sql.NVarChar, datosUsuario.correo)
      .input('direccion', sql.NVarChar, datosUsuario.direccion)
      .input('pais', sql.NVarChar, datosUsuario.pais);
    
    if (datosUsuario.contraseña) {
      query += ', contraseña = @contraseña';
      request.input('contraseña', sql.NVarChar, datosUsuario.contraseña);
    }
    
    query += ' WHERE id_usuario = @id_usuario';
    console.log('Query de actualización de usuario:', query);
    
    const result = await request.query(query);
    console.log('Usuario actualizado en la base de datos');
    console.log('Filas afectadas:', result.rowsAffected);
    
    // Si se proporciona nueva foto, actualizar en la tabla Perfil
    if (datos.foto) {
      console.log('Actualizando foto en tabla Perfil:', datos.foto);
      
      // Verificar si ya existe un registro en Perfil
      const perfilExistente = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .query('SELECT id_usuario FROM Perfil WHERE id_usuario = @id_usuario');
      
      if (perfilExistente.recordset.length > 0) {
        // Actualizar registro existente
        const updateFoto = await pool.request()
          .input('id_usuario', sql.Int, id_usuario)
          .input('foto', sql.NVarChar, datos.foto)
          .query('UPDATE Perfil SET foto = @foto WHERE id_usuario = @id_usuario');
        
        console.log('Foto actualizada en Perfil existente');
        console.log('Filas afectadas:', updateFoto.rowsAffected);
      } else {
        // Crear nuevo registro en Perfil
        const insertFoto = await pool.request()
          .input('id_usuario', sql.Int, id_usuario)
          .input('foto', sql.NVarChar, datos.foto)
          .query('INSERT INTO Perfil (id_usuario, foto) VALUES (@id_usuario, @foto)');
        
        console.log('Nuevo registro creado en Perfil con foto');
        console.log('Filas afectadas:', insertFoto.rowsAffected);
      }
    }
    
    // Si es artesano, actualizar datos específicos
    if (datos.rol === 'artesano' && datos.especialidad && datos.biografia && datos.historia) {
      console.log('Actualizando datos de artesano');
      const artesanoResult = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .input('especialidad', sql.NVarChar, datos.especialidad)
        .input('biografia', sql.NVarChar, datos.biografia)
        .input('historia', sql.NVarChar, datos.historia)
        .query('UPDATE Artesano SET especialidad = @especialidad, biografia = @biografia, historia = @historia WHERE id_usuario = @id_usuario');
      
      console.log('Datos de artesano actualizados');
      console.log('Filas artesano afectadas:', artesanoResult.rowsAffected);
    }
    
    console.log('Perfil actualizado exitosamente');
  } catch (error) {
    console.error('Error en actualizarPerfilCompleto:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

/**
 * Obtiene el perfil público de un usuario
 * @param {number} id_usuario
 * @returns {Object} Perfil público del usuario
 */
async function obtenerPerfilPublico(id_usuario) {
  try {
    console.log('=== OBTENER PERFIL PÚBLICO ===');
    console.log('ID usuario:', id_usuario);
    
    const pool = await poolPromise;
    
    // Obtener datos públicos del usuario y foto del perfil
    const usuario = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        SELECT u.nombre, u.apellido, u.pais, u.rol, p.foto 
        FROM Usuario u 
        LEFT JOIN Perfil p ON u.id_usuario = p.id_usuario 
        WHERE u.id_usuario = @id_usuario
      `);
    
    console.log('Consulta usuario público ejecutada');
    console.log('Registros encontrados:', usuario.recordset.length);
    
    if (usuario.recordset.length === 0) {
      console.log('No se encontró usuario público con ID:', id_usuario);
      return null;
    }
    
    const datosUsuario = usuario.recordset[0];
    console.log('Datos básicos del usuario público:', datosUsuario);
    
    // Si es artesano, obtener datos públicos adicionales
    if (datosUsuario.rol === 'artesano') {
      console.log('Usuario público es artesano, obteniendo datos adicionales');
      const artesano = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .query('SELECT especialidad, biografia, historia FROM Artesano WHERE id_usuario = @id_usuario');
      
      console.log('Consulta artesano público ejecutada');
      console.log('Registros artesano público encontrados:', artesano.recordset.length);
      
      if (artesano.recordset.length > 0) {
        const resultado = {
          ...datosUsuario,
          especialidad: artesano.recordset[0].especialidad,
          biografia: artesano.recordset[0].biografia,
          historia: artesano.recordset[0].historia
        };
        console.log('Perfil público completo:', resultado);
        return resultado;
      }
    }
    
    console.log('Perfil público básico:', datosUsuario);
    return datosUsuario;
  } catch (error) {
    console.error('Error en obtenerPerfilPublico:', error);
    throw error;
  }
}

module.exports = {
  obtenerPerfilCompleto,
  actualizarPerfilCompleto,
  obtenerPerfilPublico
}; 