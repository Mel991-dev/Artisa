// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Verificar si hay un usuario guardado al cargar la app
      const token = localStorage.getItem('token');
      const usuarioStr = localStorage.getItem('usuario');
      
      if (token && usuarioStr) {
        const usuarioData = JSON.parse(usuarioStr);
        setUsuario(usuarioData);
        console.log('Usuario cargado desde localStorage:', usuarioData);
      } else {
        console.log('No hay usuario en localStorage');
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token, usuario) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      setUsuario(usuario);
      console.log('Usuario logueado:', usuario);
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUsuario(null);
      console.log('Usuario deslogueado');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  const updateUsuario = (nuevoUsuario) => {
    try {
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
      setUsuario(nuevoUsuario);
      console.log('Usuario actualizado:', nuevoUsuario);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const value = {
    usuario,
    login,
    logout,
    updateUsuario,
    loading
  };

  console.log('AuthContext value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 