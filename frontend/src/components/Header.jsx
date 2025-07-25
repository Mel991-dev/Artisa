// frontend/src/components/Header.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // Función para verificar y actualizar el estado del usuario
  const checkUser = () => {
    console.log('Header: Verificando usuario...');
    const token = localStorage.getItem('token');
    const usuarioStr = localStorage.getItem('usuario');
    console.log('Header: Token encontrado:', !!token);
    console.log('Header: Usuario encontrado:', !!usuarioStr);
    
    if (token && usuarioStr) {
      try {
        const usuarioData = JSON.parse(usuarioStr);
        console.log('Header: Usuario parseado:', usuarioData);
        setUsuario(usuarioData);
      } catch (error) {
        console.error('Header: Error al parsear usuario:', error);
        setUsuario(null);
      }
    } else {
      console.log('Header: No hay usuario, estableciendo null');
      setUsuario(null);
    }
  };

  // Función para obtener la URL de la foto del usuario
  const getFotoUrl = (usuario) => {
    if (!usuario) return '/img/user-default.png';
    
    if (usuario.foto) {
      // Si tiene foto personalizada, usar la URL del backend
      return `http://localhost:3000/uploads/${usuario.foto}`;
    }
    
    // Si no tiene foto, usar la imagen por defecto
    return '/img/user-default.png';
  };

  useEffect(() => {
    console.log('Header: Componente montado');
    // Verificar usuario al montar el componente
    checkUser();

    // Agregar listener para detectar cambios en localStorage
    const handleStorageChange = (e) => {
      console.log('Header: Evento storage detectado:', e.key);
      if (e.key === 'token' || e.key === 'usuario') {
        checkUser();
      }
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    // También escuchar eventos personalizados para cambios en la misma ventana
    const handleUserChange = () => {
      console.log('Header: Evento userLogin/userLogout detectado');
      checkUser();
    };

    window.addEventListener('userLogin', handleUserChange);
    window.addEventListener('userLogout', handleUserChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleUserChange);
      window.removeEventListener('userLogout', handleUserChange);
    };
  }, []);

  const handleLogout = () => {
    console.log('Header: Logout iniciado');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    // Disparar evento personalizado
    window.dispatchEvent(new Event('userLogout'));
    navigate('/login');
  };

  console.log('Header: Renderizando con usuario:', usuario);

  return (
    <header className="header-artisa">
      <div className="header-inner">
        <div className="header-logo">
          <img src="/img/logo.png" alt="Artisa logo" className="logo-img" />
        </div>
        <nav className="header-nav">
          <Link to="/">Inicio</Link>
          <Link to="/catalogo-productos">Catalogo</Link>
          <Link to="/blog">Blog</Link>
          {usuario ? (
            <div className="header-user-menu">
              <img
                src={getFotoUrl(usuario)}
                alt="Perfil"
                className="header-user-avatar"
                onClick={() => navigate('/perfil')}
                onError={(e) => {
                  e.target.src = '/img/user-default.png';
                }}
              />
              <button onClick={handleLogout} className="header-logout-btn">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link to="/login">Iniciar sesión</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
 