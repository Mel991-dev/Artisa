// frontend/src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  // Obtiene el token del almacenamiento local (localStorage)
  const token = localStorage.getItem('token');
  // Si hay token, muestra el contenido protegido; si no, redirige a /login
  return token ? children : <Navigate to="/login" />;
}
