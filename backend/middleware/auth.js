const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('=== MIDDLEWARE AUTH ===');
  console.log('Headers recibidos:', req.headers);
  
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token extraído:', token ? 'Sí' : 'No');
  
  if (!token) {
    console.log('No token encontrado');
    return res.status(401).json({ msg: 'No token, autorización denegada.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key');
    console.log('Token decodificado:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Error al verificar token:', err.message);
    return res.status(401).json({ msg: 'Token inválido.' });
  }
};
