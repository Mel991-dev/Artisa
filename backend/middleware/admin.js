// backend/middleware/admin.js
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../db');

const isAdmin = async (req, res, next) => {
    try {
        console.log('=== VERIFICANDO ADMIN ===');
        // Verificar si existe el token
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Token recibido:', token ? 'Sí' : 'No');
        
        if (!token) {
            console.log('No se encontró token en la petición');
            return res.status(401).json({ msg: 'No hay token, acceso denegado' });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key');
        console.log('Token decodificado:', decoded);
        
        // Obtener el usuario de la base de datos
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_usuario', sql.Int, decoded.id_usuario)
            .query('SELECT rol FROM Usuario WHERE id_usuario = @id_usuario');
        
        console.log('Resultado de la consulta:', result.recordset);

        if (result.recordset.length === 0) {
            return res.status(401).json({ msg: 'Usuario no encontrado' });
        }

        // Verificar si el usuario es administrador
        const userRole = result.recordset[0].rol.toLowerCase();
        console.log('Rol del usuario:', userRole);
        
        if (userRole !== 'admin' && userRole !== 'administrador') {
            return res.status(403).json({ msg: 'Acceso denegado - Se requieren privilegios de administrador' });
        }

        // Si todo está bien, continuar
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error en middleware isAdmin:', error);
        res.status(401).json({ msg: 'Token inválido' });
    }
};

module.exports = isAdmin;
