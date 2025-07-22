import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PerfilPublico.css';

const PerfilPublico = () => {
  const { id } = useParams();
  const [artesano, setArtesano] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPerfilPublico = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener datos del artesano
        const responseArtesano = await axios.get(`http://localhost:3000/api/usuarios/perfil-publico/${id}`);
        setArtesano(responseArtesano.data);

        // Obtener galería del artesano (con manejo de errores)
        try {
          const responseGaleria = await axios.get(`http://localhost:3000/api/galeria/artesano/${id}`);
          setGaleria(responseGaleria.data);
        } catch (galeriaError) {
          console.log('Galería no disponible:', galeriaError.message);
          setGaleria([]);
        }

        // Obtener productos del artesano (con manejo de errores)
        try {
          const responseProductos = await axios.get(`http://localhost:3000/api/productos/artesano/${id}`);
          setProductos(responseProductos.data);
        } catch (productosError) {
          console.log('Productos no disponibles:', productosError.message);
          setProductos([]);
        }

      } catch (err) {
        console.error('Error al cargar perfil público:', err);
        setError('Error al cargar el perfil del artesano');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarPerfilPublico();
    }
  }, [id]);

  // Función para obtener la URL de la foto
  const obtenerFotoUrl = (foto) => {
    if (foto) {
      return `http://localhost:3000/uploads/${foto}`;
    }
    return '/img/user-default.png'; // Imagen por defecto
  };

  if (loading) {
    return (
      <div className="perfil-publico-loading">
        <div className="loading-spinner"></div>
        <p>Cargando perfil del artesano...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="perfil-publico-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!artesano) {
    return (
      <div className="perfil-publico-error">
        <h2>Artesano no encontrado</h2>
        <p>El artesano que buscas no existe o no está disponible.</p>
      </div>
    );
  }

  return (
    <div className="perfil-publico-container">
      {/* Fondo naranja */}
      <div className="perfil-publico-background">
        {/* Tarjeta del perfil */}
        <div className="perfil-publico-card">
          <div className="perfil-publico-header">
            <div className="perfil-publico-foto">
              <img 
                src={obtenerFotoUrl(artesano.foto)} 
                alt={`${artesano.nombre} ${artesano.apellido}`}
                onError={(e) => {
                  e.target.src = '/img/default-user.png';
                }}
              />
            </div>
            <div className="perfil-publico-info">
              <h1 className="perfil-publico-nombre">
                {artesano.nombre} {artesano.apellido}
              </h1>
              <div className="perfil-publico-detalles">
                <div className="perfil-publico-especialidad">
                  <span className="icon">🎨</span>
                  <span>{artesano.especialidad}</span>
                </div>
                <div className="perfil-publico-ubicacion">
                  <span className="icon">📍</span>
                  <span>{artesano.pais}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="perfil-publico-biografia">
            <h3>Biografía</h3>
            <p>{artesano.biografia}</p>
          </div>
          
          <div className="perfil-publico-historia">
            <h3>Mi Historia</h3>
            <p>{artesano.historia}</p>
          </div>
        </div>
      </div>

      {/* Sección de Galería */}
      {galeria.length > 0 && (
        <div className="galeria-seccion">
          <h2>Galería de Trabajos</h2>
          <div className="galeria-grid">
            {galeria.map((imagen) => (
              <div key={imagen.id} className="galeria-item">
                <img 
                  src={`http://localhost:3000/uploads/${imagen.nombre_archivo}`}
                  alt={imagen.descripcion || 'Trabajo del artesano'}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Productos */}
      {productos.length > 0 && (
        <div className="productos-seccion">
          <h2>Productos de {artesano.nombre} {artesano.apellido}</h2>
          <div className="productos-grid">
            {productos.map((producto) => (
              <div key={producto.id} className="producto-card">
                <div className="producto-imagen">
                  <img 
                    src={`http://localhost:3000/uploads/${producto.imagen}`}
                    alt={producto.nombre}
                    onError={(e) => {
                      e.target.src = '/img/product-default.svg';
                    }}
                  />
                </div>
                <div className="producto-info">
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <p className="producto-precio">${producto.precio?.toLocaleString()}</p>
                  <button className="producto-btn">Ver Detalles</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {galeria.length === 0 && productos.length === 0 && (
        <div className="sin-contenido">
          <p>Este artesano aún no ha publicado trabajos ni productos.</p>
        </div>
      )}
    </div>
  );
};

export default PerfilPublico; 