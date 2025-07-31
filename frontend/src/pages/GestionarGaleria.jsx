import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GestionarGaleria.css';

export default function GestionarGaleria() {
  const [galeria, setGaleria] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [errores, setErrores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // Datos mock para desarrollo (después vendrán del backend)
  const mockGaleria = [
    {
      id_galeria: 1,
      nombre_archivo: 'taller-artesano1.jpg',
      ruta_archivo: '/uploads/artesanos/galeria/taller-artesano1.jpg',
      descripcion: 'Mi taller de cerámica donde trabajo',
      es_principal: true,
      fecha_subida: '2025-01-15T10:30:00'
    },
    {
      id_galeria: 2,
      nombre_archivo: 'trabajo-artesano1.jpg',
      ruta_archivo: '/uploads/artesanos/galeria/trabajo-artesano1.jpg',
      descripcion: 'Algunos de mis trabajos más recientes',
      es_principal: false,
      fecha_subida: '2025-01-14T15:45:00'
    },
    {
      id_galeria: 3,
      nombre_archivo: 'herramientas-artesano1.jpg',
      ruta_archivo: '/uploads/artesanos/galeria/herramientas-artesano1.jpg',
      descripcion: 'Mis herramientas de trabajo',
      es_principal: false,
      fecha_subida: '2025-01-13T09:20:00'
    }
  ];

  // Cargar galería al montar el componente
  useEffect(() => {
    cargarGaleria();
  }, []);

  const cargarGaleria = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Obtener ID del usuario autenticado (por ahora usamos 1, después vendrá del token)
      const id_artesano = 1; // TODO: Obtener del token decodificado
      
      const response = await axios.get(`http://localhost:3000/api/galeria/artesano/${id_artesano}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setGaleria(response.data);
    } catch (err) {
      console.error('Error al cargar galería:', err);
      setMsg('Error al cargar la galería. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarImagen = async (id_galeria) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    try {
      // Validar que no se elimine la última imagen
      if (galeria.length <= 1) {
        setMsg('Debes mantener al menos una imagen en tu galería.');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:3000/api/galeria/${id_galeria}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setGaleria(galeria.filter(img => img.id_galeria !== id_galeria));
      setMsg('Imagen eliminada correctamente.');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error('Error al eliminar imagen:', err);
      setMsg('Error al eliminar la imagen. Inténtalo de nuevo.');
    }
  };

  const establecerComoPrincipal = async (id_galeria) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(`http://localhost:3000/api/galeria/${id_galeria}/principal`, { id_artesano: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setGaleria(galeria.map(img => ({
        ...img,
        es_principal: img.id_galeria === id_galeria
      })));
      
      setMsg('Imagen establecida como principal correctamente.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error('Error al establecer imagen principal:', err);
      setMsg('Error al establecer la imagen principal. Inténtalo de nuevo.');
    }
  };

  const abrirModal = (imagen) => {
    setSelectedImage(imagen);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setEditingImage(null);
  };

  const iniciarEdicion = (imagen) => {
    setEditingImage(imagen);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setMsg('El archivo debe ser una imagen');
        return;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMsg('La imagen debe ser menor a 5MB');
        return;
      }

      setNewImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const guardarEdicion = async (id_galeria, nuevaDescripcion) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Crear FormData para enviar tanto descripción como imagen
      const formData = new FormData();
      formData.append('descripcion', nuevaDescripcion);
      
      // Si hay una nueva imagen, agregarla al FormData
      if (newImage) {
        formData.append('imagen', newImage);
      }

      console.log('Enviando actualización:', {
        id_galeria,
        descripcion: nuevaDescripcion,
        tieneNuevaImagen: !!newImage
      });

      const response = await axios.put(`http://localhost:3000/api/galeria/${id_galeria}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Respuesta del servidor:', response.data);
      
      // Actualizar estado local con la respuesta del servidor
      if (response.data.foto) {
        setGaleria(galeria.map(img => 
          img.id_galeria === id_galeria 
            ? response.data.foto
            : img
        ));
      }
      
      setEditingImage(null);
      setNewImage(null);
      setImagePreview(null);
      setMsg('Imagen actualizada correctamente.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error('Error al actualizar imagen:', err);
      setMsg(err.response?.data?.msg || 'Error al actualizar la imagen. Inténtalo de nuevo.');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="gestionar-galeria-root">
        <div className="gestionar-galeria-container">
          <div className="gestionar-galeria-header-row">
            <h1 className="gestionar-galeria-title">Gestión de Galería</h1>
            <Link to="/subir-fotos" className="gestionar-galeria-add-btn">
              + Añadir Fotos
            </Link>
          </div>
          <div className="gestionar-galeria-content">
            <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
              Cargando galería...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gestionar-galeria-root">
      <div className="gestionar-galeria-container">
        <div className="gestionar-galeria-header-row">
          <h1 className="gestionar-galeria-title">Gestión de Galería</h1>
          <Link to="/subir-fotos" className="gestionar-galeria-add-btn">
            + Añadir Fotos
          </Link>
        </div>
        
        {msg && (
          <div className="gestionar-galeria-msg" style={{
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

        <div className="gestionar-galeria-content">
          <div className="galeria-stats">
            <div className="stat-item">
              <span className="stat-number">{galeria.length}</span>
              <span className="stat-label">Fotos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{galeria.filter(img => img.es_principal).length}</span>
              <span className="stat-label">Principal</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{5 - galeria.length}</span>
              <span className="stat-label">Disponibles</span>
            </div>
          </div>

          {galeria.length === 0 ? (
            <div className="galeria-empty">
              <div className="empty-icon">📸</div>
              <h3>Tu galería está vacía</h3>
              <p>Comienza agregando fotos de tu taller y trabajos</p>
              <Link to="/subir-fotos" className="empty-btn">
                Añadir Primera Foto
              </Link>
            </div>
          ) : (
            <div className="galeria-grid">
              {galeria.map(imagen => (
                <div key={imagen.id_galeria} className="galeria-item">
                  <div className="galeria-item-header">
                    {imagen.es_principal && (
                      <span className="principal-badge">Principal</span>
                    )}
                    <div className="galeria-item-actions">
                      <button
                        onClick={() => abrirModal(imagen)}
                        className="action-btn view-btn"
                        title="Ver imagen"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => iniciarEdicion(imagen)}
                        className="action-btn edit-btn"
                        title="Editar descripción"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => eliminarImagen(imagen.id_galeria)}
                        className="action-btn delete-btn"
                        title="Eliminar imagen"
                        disabled={galeria.length <= 1}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="galeria-item-image">
                    <img 
                      src={`http://localhost:3000${imagen.ruta_archivo}`} 
                      alt={imagen.descripcion || 'Imagen de galería'}
                      onClick={() => abrirModal(imagen)}
                    />
                  </div>
                  
                  <div className="galeria-item-content">
                    {editingImage && editingImage.id_galeria === imagen.id_galeria ? (
                      <div className="edit-descripcion">
                        <div className="edit-image-preview">
                          <img 
                            src={imagePreview || `http://localhost:3000${imagen.ruta_archivo}`}
                            alt="Preview"
                          />
                          <div className="edit-image-overlay">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              style={{ display: 'none' }}
                              id={`file-${imagen.id_galeria}`}
                            />
                            <label 
                              htmlFor={`file-${imagen.id_galeria}`}
                              className="change-image-btn"
                            >
                              📷 Cambiar imagen
                            </label>
                          </div>
                        </div>
                        <textarea
                          defaultValue={imagen.descripcion || ''}
                          placeholder="Describe esta imagen..."
                          maxLength="500"
                          className="edit-descripcion-textarea"
                        />
                        <div className="edit-actions">
                          <button 
                            className="edit-btn-cancel" 
                            onClick={() => {
                              setEditingImage(null);
                              setNewImage(null);
                              setImagePreview(null);
                            }}
                          >
                            Cancelar
                          </button>
                          <button 
                            className="edit-btn-save"
                            onClick={(e) => {
                              const textarea = e.target.closest('.edit-descripcion').querySelector('textarea');
                              guardarEdicion(imagen.id_galeria, textarea.value);
                            }}
                          >
                            Guardar cambios
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="galeria-item-info">
                        <p className="galeria-descripcion">
                          {imagen.descripcion || 'Sin descripción'}
                        </p>
                        <p className="galeria-fecha">
                          {formatearFecha(imagen.fecha_subida)}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="galeria-item-footer">
                    {!imagen.es_principal && (
                      <button
                        onClick={() => establecerComoPrincipal(imagen.id_galeria)}
                        className="set-principal-btn"
                      >
                        Establecer como Principal
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para ver imagen */}
      {showModal && selectedImage && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={cerrarModal}>×</button>
            <img 
              src={`http://localhost:3000${selectedImage.ruta_archivo}`} 
              alt={selectedImage.descripcion || 'Imagen de galería'}
            />
            <div className="modal-info">
              <p>{selectedImage.descripcion || 'Sin descripción'}</p>
              <small>{formatearFecha(selectedImage.fecha_subida)}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 