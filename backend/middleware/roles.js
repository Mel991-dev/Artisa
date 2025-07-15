// backend/middleware/roles.js
function checkRole(roles = []) {
  return (req, res, next) => {
    // Verifica si el rol del usuario (req.user.rol) está incluido en la lista de roles permitidos
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ msg: 'No tienes permisos para esta acción.' });
    }
    // Si tiene permiso, continúa con la siguiente función o ruta
    next();
  };
}
module.exports = checkRole;
