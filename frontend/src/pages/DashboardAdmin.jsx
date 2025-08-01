import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardAdmin.css';

export default function DashboardAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [artesanos, setArtesanos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('compradores'); // 'compradores' o 'artesanos'
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompradores, setFilteredCompradores] = useState([]);
  const [filteredArtesanos, setFilteredArtesanos] = useState([]);
  const navigate = useNavigate();

  // Configurar interceptor de Axios para incluir token automáticamente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Recargar usuarios cuando se regresa al dashboard (detectar cambios en la URL)
  useEffect(() => {
    const handleFocus = () => {
      // Recargar cuando la ventana vuelve a tener foco (después de editar)
      cargarUsuarios();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Filtrar usuarios cuando cambie el término de búsqueda
  useEffect(() => {
    filtrarUsuarios();
  }, [searchTerm, usuarios, artesanos]);

  const cargarUsuarios = async () => {
    try {
      setIsLoading(true);
      
      // Cargar todos los usuarios con sus perfiles
      const responseUsuarios = await axios.get('http://localhost:3000/api/admin/usuarios');
      const usuariosData = responseUsuarios.data;
      
      console.log('Usuarios cargados:', usuariosData);
      
      // Separar compradores y artesanos
      const compradores = usuariosData.filter(user => user.rol === 'comprador');
      const artesanosData = usuariosData.filter(user => user.rol === 'artesano');
      
      // Cargar información adicional de artesanos
      const artesanosCompletos = await Promise.all(
        artesanosData.map(async (artesano) => {
          try {
            const responseArtesano = await axios.get(`http://localhost:3000/api/admin/artesanos/${artesano.id_usuario}`);
            return {
              ...artesano,
              ...responseArtesano.data
            };
          } catch (err) {
            console.error(`Error al cargar datos de artesano ${artesano.id_usuario}:`, err);
            return artesano;
          }
        })
      );
      
      setUsuarios(compradores);
      setArtesanos(artesanosCompletos);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setMsg('Error al cargar los usuarios. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const filtrarUsuarios = () => {
    const termino = searchTerm.toLowerCase();
    
    // Filtrar compradores
    const compradoresFiltrados = usuarios.filter(user => 
      user.nombre?.toLowerCase().includes(termino) ||
      user.apellido?.toLowerCase().includes(termino) ||
      user.correo?.toLowerCase().includes(termino)
    );
    
    // Filtrar artesanos
    const artesanosFiltrados = artesanos.filter(user => 
      user.nombre?.toLowerCase().includes(termino) ||
      user.apellido?.toLowerCase().includes(termino) ||
      user.correo?.toLowerCase().includes(termino) ||
      user.especialidad?.toLowerCase().includes(termino)
    );
    
    setFilteredCompradores(compradoresFiltrados);
    setFilteredArtesanos(artesanosFiltrados);
  };

  const eliminarUsuario = async (id_usuario, rol) => {
    const tipoUsuario = rol === 'artesano' ? 'artesano' : 'usuario';
    if (!window.confirm(`¿Estás seguro de que quieres eliminar este ${tipoUsuario}?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/admin/usuarios/${id_usuario}`);
      setMsg(`${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)} eliminado correctamente.`);
      cargarUsuarios(); // Recargar lista
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setMsg('Error al eliminar el usuario. Inténtalo de nuevo.');
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Función para obtener la URL de la foto de perfil
  const obtenerFotoUrl = (foto) => {
    if (foto) {
      return `http://localhost:3000/uploads/${foto}`;
    }
    return '/img/user-default.png';
  };

  if (isLoading) {
    return (
      <div className="dashboard-admin-root">
        <div className="dashboard-admin-container">
          <div className="dashboard-admin-header-row">
            <h1 className="dashboard-admin-title">Dashboard Administrativo</h1>
          </div>
          <div className="dashboard-admin-table-wrapper">
            <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
              Cargando usuarios...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-admin-root">
      <div className="dashboard-admin-container">
        <div className="dashboard-admin-header-row">
          <h1 className="dashboard-admin-title">Dashboard Administrativo</h1>
          <div className="admin-stats">
            <span className="stat-item">
              👥 Compradores: {usuarios.length}
            </span>
            <span className="stat-item">
              🎨 Artesanos: {artesanos.length}
            </span>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${activeTab === 'compradores' ? 'active' : ''}`}
            onClick={() => setActiveTab('compradores')}
          >
            👥 Compradores ({filteredCompradores.length})
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'artesanos' ? 'active' : ''}`}
            onClick={() => setActiveTab('artesanos')}
          >
            🎨 Artesanos ({filteredArtesanos.length})
          </button>
        </div>
        
        {msg && (
          <div className="dashboard-msg" style={{
            padding: '0.8rem 1rem',
            marginBottom: '1rem',
            borderRadius: '6px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            textAlign: 'center'
          }}>
            {msg}
          </div>
        )}

        {/* Contenido de Compradores */}
        {activeTab === 'compradores' && (
          <div className="dashboard-admin-table-wrapper">
            <table className="dashboard-admin-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Información Personal</th>
                  <th>Contacto</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompradores.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center', color: '#666', padding: '2rem'}}>
                      {searchTerm ? 'No se encontraron compradores con ese criterio.' : 'No hay compradores registrados.'}
                    </td>
                  </tr>
                ) : (
                  filteredCompradores.map(usuario => (
                    <tr key={usuario.id_usuario}>
                      <td className="table-cell-photo">
                        <img 
                          src={obtenerFotoUrl(usuario.foto_perfil)}
                          alt={`${usuario.nombre} ${usuario.apellido}`}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '2px solid #eee'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/user-default.png';
                          }}
                        />
                      </td>
                      <td className="table-cell-info">
                        <div className="user-info">
                          <div className="user-name">
                            {usuario.nombre} {usuario.apellido}
                          </div>
                          <div className="user-id">
                            ID: {usuario.id_usuario}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell-contact">
                        <div className="contact-info">
                          <div className="email">{usuario.correo}</div>
                        </div>
                      </td>
                      <td className="table-cell-location">
                        <div className="location-info">
                          <div className="address">{usuario.direccion}</div>
                          <div className="country">{usuario.pais}</div>
                        </div>
                      </td>
                      <td className="table-cell-status">
                        <span className="status-badge comprador">
                          Comprador
                        </span>
                      </td>
                      <td className="table-cell-actions">
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <button
                            onClick={() => navigate(`/admin/editar-usuario/${usuario.id_usuario}`)}
                            style={{
                              background: '#EF6210',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarUsuario(usuario.id_usuario, usuario.rol)}
                            style={{
                              background: '#dc3545',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Contenido de Artesanos */}
        {activeTab === 'artesanos' && (
          <div className="dashboard-admin-table-wrapper">
            <table className="dashboard-admin-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Información Personal</th>
                  <th>Especialidad</th>
                  <th>Biografía</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtesanos.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center', color: '#666', padding: '2rem'}}>
                      {searchTerm ? 'No se encontraron artesanos con ese criterio.' : 'No hay artesanos registrados.'}
                    </td>
                  </tr>
                ) : (
                  filteredArtesanos.map(artesano => (
                    <tr key={artesano.id_usuario}>
                      <td className="table-cell-photo">
                        <img 
                          src={obtenerFotoUrl(artesano.foto_perfil)}
                          alt={`${artesano.nombre} ${artesano.apellido}`}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '2px solid #eee'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/user-default.png';
                          }}
                        />
                      </td>
                      <td className="table-cell-info">
                        <div className="user-info">
                          <div className="user-name">
                            {artesano.nombre} {artesano.apellido}
                          </div>
                          <div className="user-id">
                            ID: {artesano.id_usuario}
                          </div>
                          <div className="user-email">
                            {artesano.correo}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell-specialty">
                        <div className="specialty-info">
                          <span className="specialty-badge">
                            {artesano.especialidad || 'Sin especialidad'}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell-bio">
                        <div className="bio-content">
                          {artesano.biografia && artesano.biografia.length > 100 
                            ? `${artesano.biografia.substring(0, 100)}...` 
                            : artesano.biografia || 'Sin biografía'}
                        </div>
                      </td>
                      <td className="table-cell-status">
                        <span className="status-badge artesano">
                          Artesano
                        </span>
                      </td>
                      <td className="table-cell-actions">
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <button
                            onClick={() => navigate(`/admin/editar-artesano/${artesano.id_usuario}`)}
                            style={{
                              background: '#EF6210',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarUsuario(artesano.id_usuario, artesano.rol)}
                            style={{
                              background: '#dc3545',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}