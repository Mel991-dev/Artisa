import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './VerGaleria.css';

export default function VerGaleria() {
  const { id_artesano } = useParams();
  const [galeria, setGaleria] = useState([]);
  const [artesano, setArtesano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Simular datos del artesano
  const mockArtesano = {
    id: id_artesano || 1,
    nombre: "María González",
    oficio: "Ceramista",
    descripcion: "Especialista en cerámica tradicional con más de 15 años de experiencia.",
    ubicacion: "Bogotá, Colombia"
  };

  // Simular datos de la galería completa
  const mockGaleriaCompleta = [
    {
      id: 1,
      url_imagen: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      descripcion: "Jarrón tradicional con motivos indígenas",
      es_principal: true,
      fecha_creacion: "2024-01-15"
    },
    {
      id: 2,
      url_imagen: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      descripcion: "Tazas artesanales con esmaltes naturales",
      es_principal: false,
      fecha_creacion: "2024-01-10"
    },
    {
      id: 3,
      url_imagen: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      descripcion: "Platos decorativos con técnicas ancestrales",
      es_principal: false,
      fecha_creacion: "2024-01-05"
    },
    {
      id: 4,
      url_imagen: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      descripcion: "Macetas con diseños únicos",
      es_principal: false,
      fecha_creacion: "2024-01-01"
    },
    {
      id: 5,
      url_imagen: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      descripcion: "Vasijas ceremoniales",
      es_principal: false,
      fecha_creacion: "2023-12-28"
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setArtesano(mockArtesano);
        setGaleria(mockGaleriaCompleta);
        
      } catch (err) {
        setError('Error al cargar la galería');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id_artesano]);

  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % galeria.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(galeria[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? galeria.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedImage(galeria[prevIndex]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  };

  // Funciones para probar el grid inteligente
  const cambiarNumeroImagenes = (numero) => {
    setGaleria(mockGaleriaCompleta.slice(0, numero));
  };

  if (loading) {
    return (
      <div className="ver-galeria-root">
        <div className="ver-galeria-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando galería...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ver-galeria-root">
        <div className="ver-galeria-container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/" className="back-btn">Volver al inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ver-galeria-root">
      <div className="ver-galeria-container">
        {/* Header del artesano */}
        <div className="artesano-header">
          <div className="artesano-info">
            <h1 className="artesano-nombre">{artesano.nombre}</h1>
            <p className="artesano-oficio">{artesano.oficio}</p>
            <p className="artesano-descripcion">{artesano.descripcion}</p>
            <p className="artesano-ubicacion">📍 {artesano.ubicacion}</p>
          </div>
          <div className="artesano-stats">
            <div className="stat-item">
              <span className="stat-number">{galeria.length}</span>
              <span className="stat-label">Fotos</span>
            </div>
          </div>
        </div>

        {/* Galería de fotos */}
        <div className="galeria-section">
          <h2 className="galeria-title">Galería de Trabajos</h2>
          
          {galeria.length === 0 ? (
            <div className="empty-gallery">
              <span className="empty-icon">📷</span>
              <h3>Galería vacía</h3>
              <p>Este artesano aún no ha subido fotos a su galería.</p>
            </div>
          ) : (
            <div className="galeria-grid">
              {galeria.map((foto, index) => (
                <div 
                  key={foto.id} 
                  className={`galeria-item ${foto.es_principal ? 'principal' : ''}`}
                  onClick={() => openModal(foto, index)}
                >
                  <div className="foto-container">
                    <img 
                      src={foto.url_imagen} 
                      alt={foto.descripcion || 'Trabajo artesanal'}
                      loading="lazy"
                    />
                    {foto.es_principal && (
                      <div className="principal-badge">
                        <span>⭐ Principal</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        <div className="navigation-actions">
          <Link to={`/public-profile/${id_artesano}`} className="back-to-profile-btn">
            ← Ver perfil completo
          </Link>
          <Link to="/" className="home-btn">
            🏠 Inicio
          </Link>
        </div>
      </div>

      {/* Modal de imagen */}
      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-image-container">
              <img 
                src={selectedImage.url_imagen} 
                alt={selectedImage.descripcion || 'Trabajo artesanal'}
              />
            </div>
            
            <div className="modal-info">
              {selectedImage.descripcion && (
                <p className="modal-description">{selectedImage.descripcion}</p>
              )}
              <p className="modal-date">
                {new Date(selectedImage.fecha_creacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="modal-navigation">
              <button className="nav-btn prev-btn" onClick={prevImage}>
                ‹
              </button>
              <span className="image-counter">
                {currentIndex + 1} de {galeria.length}
              </span>
              <button className="nav-btn next-btn" onClick={nextImage}>
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 