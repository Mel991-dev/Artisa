// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { nombre, apellido, correo, direccion, pais, contraseña, rol, especialidad, biografia, historia } = req.body;
  try {
    // LOG: Verifica qué datos llegan al backend
    console.log("Datos recibidos en /register:", req.body);

    // Verifica si el usuario ya existe
    const pool = await poolPromise;
    const userExists = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .query('SELECT * FROM Usuario WHERE correo = @correo');
    if (userExists.recordset.length > 0) {
      return res.status(400).json({ msg: 'El correo ya está registrado.' });
    }
    // Hashea la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);
    // Inserta el usuario y obtiene el id insertado
    const result = await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('apellido', sql.NVarChar, apellido)
      .input('correo', sql.NVarChar, correo)
      .input('direccion', sql.NVarChar, direccion)
      .input('pais', sql.NVarChar, pais)
      .input('contraseña', sql.NVarChar, hashedPassword)
      .input('rol', sql.NVarChar, rol)
      .query(`INSERT INTO Usuario (nombre, apellido, correo, direccion, pais, contraseña, rol)
              OUTPUT INSERTED.id_usuario
              VALUES (@nombre, @apellido, @correo, @direccion, @pais, @contraseña, @rol)`);
    const id_usuario = result.recordset[0].id_usuario;

    // Si el rol es artesano, inserta en la tabla Artesano
    if (rol === 'artesano') {
      // LOG: Verifica qué datos se intentan insertar en Artesano
      console.log("Insertando en Artesano:", { id_usuario, especialidad, biografia, historia });
      await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .input('especialidad', sql.NVarChar, especialidad)
        .input('biografia', sql.NVarChar, biografia)
        .input('historia', sql.NVarChar, historia)
        .query(`INSERT INTO Artesano (id_usuario, especialidad, biografia, historia)
                VALUES (@id_usuario, @especialidad, @biografia, @historia)`);
    }

    res.status(201).json({ msg: 'Usuario registrado correctamente.' });
  } catch (err) {
    // LOG: Muestra el error completo en consola
    console.error("Error en /register:", err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    console.log('=== INICIO LOGIN ===');
    console.log('Intentando login para:', correo);
    
    const pool = await poolPromise;
    const user = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .query('SELECT * FROM Usuario WHERE correo = @correo');
    
    console.log('Usuario encontrado:', user.recordset[0] ? 'Sí' : 'No');
    if (user.recordset.length === 0) {
      return res.status(400).json({ msg: 'Usuario o contraseña incorrectos.' });
    }
    const usuario = user.recordset[0];
    const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!validPassword) {
      return res.status(400).json({ msg: 'Usuario o contraseña incorrectos.' });
    }
    console.log('Rol del usuario:', usuario.rol);
    
    // Genera el token con información completa
    const tokenPayload = { 
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: usuario.rol,
      foto: usuario.foto || null
    };
    
    console.log('Token payload:', tokenPayload);
    
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'tu_secret_key',
      { expiresIn: '24h' }
    );
    
    // Devuelve información más completa del usuario
    const usuarioResponse = {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: usuario.rol,
      foto: usuario.foto || null,
      direccion: usuario.direccion,
      pais: usuario.pais
    };
    
    res.json({ token, usuario: usuarioResponse });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

module.exports = router;
