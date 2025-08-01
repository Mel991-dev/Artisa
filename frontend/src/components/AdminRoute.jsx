import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AdminRoute = ({ children }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        // Primero verificamos localmente
        const decodedToken = jwtDecode(token);
        
        if (decodedToken.rol !== 'administrador') {
          setIsVerifying(false);
          return;
        }

        // Luego verificamos con el backend
        const response = await axios.get('http://localhost:3000/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Respuesta del servidor:', response.data);

        if (response.data.user && response.data.user.rol === 'administrador') {
          setIsAdmin(true);
        } else {
          console.log('Usuario no es administrador:', response.data);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error al verificar rol de administrador:', error);
        localStorage.removeItem('token'); // Limpiamos el token si es inválido
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAdmin();
  }, []);

  if (isVerifying) {
    return <div>Verificando permisos...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
