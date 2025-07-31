import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditarArticulo.css';
import axios from 'axios';

const EditarArticulo = () => {
  const { id_post } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenActual, setImagenActual] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar datos del artículo al montar el componente
  useEffect(() => {
    cargarArticulo();
  }, [id_post]);

  const cargarArticulo = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/api/blog/articulos/${id_post}`);
      const articulo = response.data;
      
      setTitulo(articulo.titulo || '');
      setContenido(articulo.contenido || '');
      setImagenActual(articulo.imagen_blog || '');
      setError('');
    } catch (err) {
      console.error('Error al cargar artículo:', err);
      setError('Error al cargar el artículo. Verifica que el artículo existe.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
  };

  const handleSubmit = async () => {
    if (!titulo.trim()) return alert('Por favor, ingresa un título.');
    if (!contenido.trim()) return alert('Por favor, escribe el contenido.');

    if (contenido.length < 500) {
      const confirmar = window.confirm('El contenido tiene menos de 500 caracteres. ¿Deseas continuar?');
      if (!confirmar) return;
    }

    try {
      // Preparar datos para actualizar
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('contenido', contenido);
      
      // Solo agregar imagen si se seleccionó una nueva
      if (imagen) {
        formData.append('imagen_blog', imagen);
      }

      // Enviar actualización al backend
      const response = await axios.put(`http://localhost:3000/api/blog/articulos/${id_post}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('¡Artículo actualizado exitosamente!');
      // Redirigir al dashboard
      navigate('/dashboard-artesano');
    } catch (err) {
      alert('Error al actualizar el artículo.');
      console.error('Error al actualizar artículo:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="header-title">Cargando artículo...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="header-title">Error</h1>
          <p className="header-subtitle">{error}</p>
          <button 
            onClick={() => navigate('/dashboard-artesano')}
            style={{
              background: '#D68F48',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Editar Artículo</h1>
        <p className="header-subtitle">
          Modifica tu artículo para compartir tu experiencia artesanal con la comunidad
        </p>
      </div>

      {/* Sección 1 - Título */}
      <div className="form-section">
        <div className="section-header">
          <div className="section-number">1</div>
          <h2 className="section-title">Título del Artículo</h2>
        </div>
        <div className="form-group">
          <label className="form-label">Título del Artículo <span className="required">*</span></label>
          <input
            type="text"
            className="form-input"
            maxLength={100}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Mi Experiencia Aprendiendo Cerámica Tradicional"
            required
          />
          <div className={`character-count ${titulo.length > 100 ? 'warning' : ''}`}>
            {titulo.length}/100 caracteres
          </div>
        </div>
      </div>

      {/* Sección 2 - Imagen */}
      <div className="form-section">
        <div className="section-header">
          <div className="section-number">2</div>
          <h2 className="section-title">Imagen de Portada</h2>
        </div>
        <div className="form-group">
          <label className="form-label">Imagen Principal (Recomendado: 1200x600px)</label>
          
          {/* Mostrar imagen actual si existe */}
          {imagenActual && (
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                Imagen actual:
              </p>
              <img 
                src={`http://localhost:3000/uploads/blog/${imagenActual}`}
                alt="Imagen actual"
                style={{
                  maxWidth: '200px',
                  maxHeight: '100px',
                  borderRadius: '8px',
                  border: '2px solid #ddd'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div
            className="image-upload-area"
            onClick={() => document.getElementById('coverImage').click()}
          >
            <div className="upload-icon">🖼️</div>
            <div className="upload-title">
              {imagen ? `Nueva imagen seleccionada: ${imagen.name}` : 'Selecciona una nueva imagen (opcional)'}
            </div>
            <div className="upload-subtitle">Haz clic para seleccionar una nueva imagen</div>
            <div className="upload-specs">Formatos: PNG, JPG, WEBP • Tamaño máximo: 5MB</div>
          </div>
          <input
            type="file"
            id="coverImage"
            className="file-input"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* Sección 3 - Contenido */}
      <div className="form-section">
        <div className="section-header">
          <div className="section-number">3</div>
          <h2 className="section-title">Contenido del Artículo</h2>
        </div>
        <div className="form-group">
          <label className="form-label">Escribe tu historia <span className="required">*</span></label>
          <textarea
            className="form-input form-textarea"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Comparte tu experiencia, técnicas aprendidas, desafíos superados..."
            required
          />
          <div className={`character-count ${contenido.length < 500 ? 'warning' : ''}`}>
            Caracteres: {contenido.length} {contenido.length < 500 && ' (mínimo 500 recomendado)'}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="action-section">
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            className="publish-btn" 
            type="button" 
            onClick={handleSubmit}
            style={{ background: '#D68F48' }}
          >
            💾 Guardar Cambios
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/dashboard-artesano')}
            style={{
              background: '#666',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              padding: '16px 30px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ❌ Cancelar
          </button>
        </div>
        <p className="terms-text">
          Al actualizar tu artículo, aceptas nuestros <a href="#" className="terms-link">términos de uso</a> y <a href="#" className="terms-link">política de privacidad</a>
        </p>
      </div>
    </div>
  );
};

export default EditarArticulo;
