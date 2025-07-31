// frontend/src/components/Header.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
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

  // Función para alternar el menú
  const toggleMenu = () => {
    console.log('Header: Toggle menu');
    setMenuAbierto(!menuAbierto);
  };

  const cerrarMenu = () => {
    console.log('Header: Cerrar menu');
    setMenuAbierto(false);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuContainer = document.querySelector('.header-user-section');
      if (menuAbierto && menuContainer && !menuContainer.contains(event.target)) {
        cerrarMenu();
      }
    };

    if (menuAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuAbierto]);

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

  const handleDashboardClick = () => {
    console.log('Header: Navegando al dashboard artesano');
    setMenuAbierto(false);
    navigate('/dashboard-artesano');
  };

  const handleLogout = () => {
    console.log('Header: Logout iniciado');
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    // Limpiar estado local
    setUsuario(null);
    setMenuAbierto(false);
    
    // Disparar evento personalizado para notificar a otros componentes
    window.dispatchEvent(new Event('userLogout'));
    
    // Limpiar cualquier estado de autenticación en el contexto si existe
    if (window.authContext && window.authContext.logout) {
      window.authContext.logout();
    }
    
    // Redirigir al login
    navigate('/login');
    
    console.log('Header: Logout completado');
  };

  console.log('Header: Renderizando con usuario:', usuario);

  return (
    <header className="header-artisa">
      <div className="header-inner">
        <div className="header-logo">
          <img src="/img/artisaLogo.png" alt="Artisa logo" className="logo-img" style={{width: '48px', marginRight: '12px'}} />
        </div>
        <nav className="header-nav">
          <Link to="/">Inicio</Link>
          <Link to="/catalogo-productos">Catálogo</Link>
          <Link to="/blog">Blog</Link>
          {usuario ? (
            <div className="header-user-section">
              <img
                src={getFotoUrl(usuario)}
                alt="Perfil"
                className="header-user-avatar"
                onClick={() => navigate('/perfil')}
                onError={(e) => {
                  e.target.src = '/img/user-default.png';
                }}
              />
              <button 
                className="header-menu-btn"
                onClick={toggleMenu}
                aria-label="Abrir menú"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </button>
              
              {/* Menú desplegable */}
              {menuAbierto && (
                <div className="header-dropdown-menu">
                  <button 
                    onClick={() => {
                      console.log('Header: Clic en Dashboard Artesano');
                      handleDashboardClick();
                    }}
                    className="header-menu-item"
                  >
                    🎨 Dashboard Artesano
                  </button>
                  <button 
                    onClick={() => {
                      console.log('Header: Clic en Cerrar sesión');
                      handleLogout();
                    }}
                    className="header-menu-item"
                  >
                    🚪 Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Iniciar sesión</Link>
          )}
        </nav>
      </div>
      
      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {/* Este overlay ya no es necesario con el nuevo enfoque */}
    </header>
  );
};

export default Header;
 