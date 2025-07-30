import React, { useState } from 'react';
import './CrearArticulo.css';
import axios from 'axios';

const CrearArticulo = () => {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
  };

  const handleSubmit = async () => {
    if (!titulo.trim()) return alert('Por favor, ingresa un título.');
    if (!imagen) return alert('Por favor, selecciona una imagen.');
    if (!contenido.trim()) return alert('Por favor, escribe el contenido.');

    if (contenido.length < 500) {
      const confirmar = window.confirm('El contenido tiene menos de 500 caracteres. ¿Deseas continuar?');
      if (!confirmar) return;
    }

    try {
      // Preparar datos para la tabla BlogPost
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('contenido', contenido);
      formData.append('imagen_blog', imagen);
      // id_usuario: por ahora fijo, luego se tomará del usuario autenticado
      formData.append('id_usuario', 1);

      // fecha_publicacion: el backend puede asignarla automáticamente, pero si se requiere:
      // formData.append('fecha_publicacion', new Date().toISOString());

      // Enviar al backend (ruta pendiente de crear)
      const response = await axios.post('http://localhost:3000/api/blog/articulos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('¡Artículo publicado exitosamente!');
      // Limpiar formulario
      setTitulo('');
      setContenido('');
      setImagen(null);
    } catch (err) {
      alert('Error al publicar el artículo.');
      console.error('Error al publicar artículo:', err);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Comparte Tu Historia Artesanal</h1>
        <p className="header-subtitle">
          Inspira a otros artesanos compartiendo tu experiencia, técnicas y conocimientos con nuestra comunidad
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
          <label className="form-label">Imagen Principal <span className="required">*</span> (Recomendado: 1200x600px)</label>
          <div
            className="image-upload-area"
            onClick={() => document.getElementById('coverImage').click()}
          >
            <div className="upload-icon">🖼️</div>
            <div className="upload-title">
              {imagen ? `Imagen seleccionada: ${imagen.name}` : 'Sube la imagen de portada'}
            </div>
            <div className="upload-subtitle">Haz clic para seleccionar una imagen</div>
            <div className="upload-specs">Formatos: PNG, JPG, WEBP • Tamaño máximo: 5MB</div>
          </div>
          <input
            type="file"
            id="coverImage"
            className="file-input"
            accept="image/*"
            onChange={handleImageChange}
            required
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

      {/* Publicar */}
      <div className="action-section">
        <button className="publish-btn" type="button" onClick={handleSubmit}>
          📝 Publicar Artículo
        </button>
        <p className="terms-text">
          Al publicar tu artículo, aceptas nuestros <a href="#" className="terms-link">términos de uso</a> y <a href="#" className="terms-link">política de privacidad</a>
        </p>
      </div>
    </div>
  );
};

export default CrearArticulo;
