// backend/routes/auth.js
const express = require('express');
const req = require('express/lib/request');
const router = express.Router();

// Endpoint de prueba para registro
// Recibe: nombre, correo, contraseña, rol
router.post('/register', (req, res) => {
  res.json({ msg: 'Registro funcionando (endpoint de prueba)' });
  // Aquí iría la lógica real de registro (validación, hash, guardar en BD)
  // Por ahora, solo responde para pruebas
});

// Endpoint de login de usuario
// Recibe: correo, contraseña
router.post('/login', (req, res)=> {
  //respuesta del login para encontrar usuario registrado
  res.json({msg: 'Login funcionando (endpoint de prueba)'});
});

module.exports = router;


// backend/routes/auth.js
/*const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;
  try {
    // Verifica si el usuario ya existe
    const pool = await sql.connect();
    const userExists = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .query('SELECT * FROM Usuario WHERE correo = @correo');
    if (userExists.recordset.length > 0) {
      return res.status(400).json({ msg: 'El correo ya está registrado.' });
    }
    // Hashea la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);
    // Inserta el usuario
    await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('correo', sql.NVarChar, correo)
      .input('contraseña', sql.NVarChar, hashedPassword)
      .input('rol', sql.NVarChar, rol)
      .query('INSERT INTO Usuario (nombre, correo, contraseña, rol) VALUES (@nombre, @correo, @contraseña, @rol)');
    res.status(201).json({ msg: 'Usuario registrado correctamente.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const pool = await sql.connect();
    const user = await pool.request()
      .input('correo', sql.NVarChar, correo)
      .query('SELECT * FROM Usuario WHERE correo = @correo');
    if (user.recordset.length === 0) {
      return res.status(400).json({ msg: 'Usuario o contraseña incorrectos.' });
    }
    const usuario = user.recordset[0];
    const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!validPassword) {
      return res.status(400).json({ msg: 'Usuario o contraseña incorrectos.' });
    }
    // Genera el token
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token, usuario: { id: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

module.exports = router;*/
