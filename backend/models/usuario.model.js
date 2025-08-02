// backend/models/usuario.model.js
const { poolPromise, sql } = require('../db');
const bcrypt = require('bcryptjs');

/**
 * Verifica la unicidad de correo e identificación
 * @param {string} correo - Correo electrónico
 * @param {string} identificacion - Número de identificación
 * @param {number} id_usuario_excluir - ID de usuario a excluir (para actualizaciones)
 * @returns {Array} Campos duplicados encontrados
 */
async function verificarUnicidad(correo, identificacion, id_usuario_excluir = null) {
  try {
    console.log('=== VERIFICAR UNICIDAD ===');
    console.log('Correo:', correo);
    console.log('Identificación:', identificacion);
    console.log('Excluir ID:', id_usuario_excluir);
    
    const pool = await poolPromise;
    
    let query = `
      SELECT 
        CASE WHEN EXISTS (
          SELECT 1 FROM Usuario 
          WHERE correo = @correo 
          ${id_usuario_excluir ? 'AND id_usuario != @id_usuario_excluir' : ''}
        ) THEN 'correo' ELSE NULL END as correo_existe,
        CASE WHEN EXISTS (
          SELECT 1 FROM Usuario 
          WHERE identificacion = @identificacion 
          ${id_usuario_excluir ? 'AND id_usuario != @id_usuario_excluir' : ''}
        ) THEN 'identificacion' ELSE NULL END as identificacion_existe
    `;
    
    const request = pool.request()
      .input('correo', sql.NVarChar, correo)
      .input('identificacion', sql.NVarChar, identificacion);
    
    if (id_usuario_excluir) {
      request.input('id_usuario_excluir', sql.Int, id_usuario_excluir);
    }
    
    const resultado = await request.query(query);
    
    const camposDuplicados = [];
    if (resultado.recordset[0].correo_existe) {
      camposDuplicados.push('correo');
    }
    if (resultado.recordset[0].identificacion_existe) {
      camposDuplicados.push('identificacion');
    }
    
    console.log('Campos duplicados encontrados:', camposDuplicados);
    return camposDuplicados;
  } catch (error) {
    console.error('Error en verificarUnicidad:', error);
    throw error;
  }
}

/**
 * Busca usuarios por identificación (para detección de multicuentas)
 * @param {string} identificacion - Número de identificación
 * @returns {Array} Lista de usuarios con esa identificación
 */
async function buscarPorIdentificacion(identificacion) {
  try {
    console.log('=== BUSCAR POR IDENTIFICACIÓN ===');
    console.log('Identificación:', identificacion);
    
    const pool = await poolPromise;
    const resultado = await pool.request()
      .input('identificacion', sql.NVarChar, identificacion)
      .query(`
        SELECT 
          u.id_usuario,
          u.nombre,
          u.apellido,
          u.correo,
          u.rol,
          u.fecha_creacion,
          p.foto as foto_perfil
        FROM Usuario u
        LEFT JOIN Perfil p ON u.id_usuario = p.id_usuario
        WHERE u.identificacion = @identificacion
        ORDER BY u.fecha_creacion DESC
      `);
    
    console.log('Usuarios encontrados con esta identificación:', resultado.recordset.length);
    return resultado.recordset;
  } catch (error) {
    console.error('Error en buscarPorIdentificacion:', error);
    throw error;
  }
}

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
        SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.identificacion, u.direccion, u.pais, u.rol, p.foto 
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
    
    // Obtener el rol actual del usuario
    const userCheck = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('SELECT rol FROM Usuario WHERE id_usuario = @id_usuario');
    
    if (userCheck.recordset.length === 0) {
      throw new Error('Usuario no encontrado');
    }
    
    const rolAnterior = userCheck.recordset[0].rol;
    const rolNuevo = datos.rol;
    console.log('Rol anterior:', rolAnterior, 'Nuevo rol:', rolNuevo);
    
    // Preparar datos para actualización de usuario
    const datosUsuario = {
      nombre: datos.nombre,
      apellido: datos.apellido,
      correo: datos.correo,
      identificacion: datos.identificacion,
      direccion: datos.direccion,
      pais: datos.pais,
      rol: datos.rol
    };

    // Verificar unicidad antes de actualizar
    const camposDuplicados = await verificarUnicidad(
      datos.correo, 
      datos.identificacion, 
      id_usuario
    );

    if (camposDuplicados.length > 0) {
      throw new Error(`Los siguientes campos ya están en uso: ${camposDuplicados.join(', ')}`);
    }
    
    // Si se proporciona nueva contraseña, hashearla
    if (datos.contraseña) {
      console.log('Hasheando nueva contraseña');
      const salt = await bcrypt.genSalt(10);
      datosUsuario.contraseña = await bcrypt.hash(datos.contraseña, salt);
    }
    
    // Actualizar datos básicos del usuario
    let query = 'UPDATE Usuario SET nombre = @nombre, apellido = @apellido, correo = @correo, identificacion = @identificacion, direccion = @direccion, pais = @pais, rol = @rol';
    const request = pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .input('nombre', sql.NVarChar, datosUsuario.nombre)
      .input('apellido', sql.NVarChar, datosUsuario.apellido)
      .input('correo', sql.NVarChar, datosUsuario.correo)
      .input('identificacion', sql.NVarChar, datosUsuario.identificacion)
      .input('direccion', sql.NVarChar, datosUsuario.direccion)
      .input('pais', sql.NVarChar, datosUsuario.pais)
      .input('rol', sql.NVarChar, datosUsuario.rol);
    
    if (datosUsuario.contraseña) {
      query += ', contraseña = @contraseña';
      request.input('contraseña', sql.NVarChar, datosUsuario.contraseña);
    }
    
    query += ' WHERE id_usuario = @id_usuario';
    console.log('Query de actualización de usuario:', query);
    
    const result = await request.query(query);
    console.log('Usuario actualizado en la base de datos');
    console.log('Filas afectadas:', result.rowsAffected);
    
    // Manejar cambios de rol
    if (rolAnterior === 'artesano' && rolNuevo !== 'artesano') {
      console.log('Eliminando datos de artesano...');
      const deleteResult = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .query('DELETE FROM Artesano WHERE id_usuario = @id_usuario');
      console.log('Datos de artesano eliminados, filas afectadas:', deleteResult.rowsAffected);
    }
    
    if (rolNuevo === 'artesano' && rolAnterior !== 'artesano') {
      console.log('Creando registro de artesano...');
      const insertResult = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .input('especialidad', sql.NVarChar, datos.especialidad || '')
        .input('biografia', sql.NVarChar, datos.biografia || '')
        .input('historia', sql.NVarChar, datos.historia || '')
        .query(`
          INSERT INTO Artesano (id_usuario, especialidad, biografia, historia)
          VALUES (@id_usuario, @especialidad, @biografia, @historia)
        `);
      console.log('Registro de artesano creado, filas afectadas:', insertResult.rowsAffected);
    }
    
    // Si es artesano (ya sea que cambió o ya era), actualizar datos específicos
    if (rolNuevo === 'artesano') {
      console.log('Actualizando datos específicos de artesano...');
      console.log('Datos a actualizar:', { especialidad: datos.especialidad, biografia: datos.biografia, historia: datos.historia });
      
      const updateArtesanoResult = await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .input('especialidad', sql.NVarChar, datos.especialidad || '')
        .input('biografia', sql.NVarChar, datos.biografia || '')
        .input('historia', sql.NVarChar, datos.historia || '')
        .query(`
          UPDATE Artesano 
          SET especialidad = @especialidad, biografia = @biografia, historia = @historia
          WHERE id_usuario = @id_usuario
        `);
      console.log('Datos de artesano actualizados, filas afectadas:', updateArtesanoResult.rowsAffected);
    }
    
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

/**
 * Obtiene los datos específicos de un artesano
 * @param {number} id_usuario
 * @returns {Object} Datos del artesano
 */
async function obtenerDatosArtesano(id_usuario) {
  try {
    console.log('=== OBTENER DATOS ARTESANO ===');
    console.log('ID usuario:', id_usuario);
    
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query('SELECT especialidad, biografia, historia FROM Artesano WHERE id_usuario = @id_usuario');
    
    console.log('Consulta artesano ejecutada');
    console.log('Registros encontrados:', result.recordset.length);
    
    if (result.recordset.length === 0) {
      console.log('No se encontraron datos de artesano para el usuario:', id_usuario);
      return null;
    }
    
    console.log('Datos de artesano encontrados:', result.recordset[0]);
    return result.recordset[0];
  } catch (error) {
    console.error('Error en obtenerDatosArtesano:', error);
    throw error;
  }
}

module.exports = {
  obtenerPerfilCompleto,
  actualizarPerfilCompleto,
  obtenerPerfilPublico,
  obtenerDatosArtesano,
  verificarUnicidad,
  buscarPorIdentificacion
}; 