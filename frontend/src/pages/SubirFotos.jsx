import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SubirFotos.css';
import axios from 'axios'; // Import axios

export default function SubirFotos() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const [principalImage, setPrincipalImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [errores, setErrores] = useState([]);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    validateAndAddFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    validateAndAddFiles(files);
  };

  const validateAndAddFiles = (files) => {
    const errores = [];
    const validFiles = [];

    files.forEach(file => {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        errores.push(`${file.name} no es una imagen válida.`);
        return;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        errores.push(`${file.name} es demasiado grande (máximo 5MB).`);
        return;
      }

      // Validar límite de archivos
      if (selectedFiles.length + validFiles.length >= 5) {
        errores.push('No puedes subir más de 5 imágenes.');
        return;
      }

      validFiles.push(file);
    });

    if (errores.length > 0) {
      setErrores(errores);
      setTimeout(() => setErrores([]), 5000);
      return;
    }

    // Agregar archivos válidos
    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setMsg('');
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      
      // Si se eliminó la imagen principal, resetear
      if (principalImage === fileId) {
        setPrincipalImage(null);
      }
      
      return updated;
    });
  };

  const handleDescriptionChange = (fileId, description) => {
    setDescriptions(prev => ({
      ...prev,
      [fileId]: description
    }));
  };

  const handlePrincipalChange = (fileId) => {
    setPrincipalImage(principalImage === fileId ? null : fileId);
  };

  const validateForm = () => {
    const errores = [];

    if (selectedFiles.length === 0) {
      errores.push('Debes seleccionar al menos una imagen.');
    }

    if (selectedFiles.length > 5) {
      errores.push('No puedes subir más de 5 imágenes.');
    }

    return errores;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrores([]);
    setMsg('');

    const errores = validateForm();
    if (errores.length > 0) {
      setErrores(errores);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Obtener ID del usuario autenticado (por ahora usamos 1, después vendrá del token)
      const id_artesano = 1; // TODO: Obtener del token decodificado

      // Subir cada imagen individualmente
      for (const fileObj of selectedFiles) {
        const formData = new FormData();
        formData.append('imagen', fileObj.file);
        formData.append('id_artesano', id_artesano);
        formData.append('descripcion', descriptions[fileObj.id] || '');
        formData.append('es_principal', principalImage === fileObj.id ? 'true' : 'false');

        console.log('Subiendo imagen:', fileObj.name);

        await axios.post('http://localhost:3000/api/galeria', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setMsg('¡Imágenes subidas exitosamente!');
      
      // Limpiar formulario
      setSelectedFiles([]);
      setDescriptions({});
      setPrincipalImage(null);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/gestionar-galeria');
      }, 2000);

    } catch (err) {
      console.error('Error al subir imágenes:', err);
      if (err.response?.data?.msg) {
        setMsg(err.response.data.msg);
      } else if (err.response?.data?.errores) {
        setErrores(err.response.data.errores);
      } else {
        setMsg('Error al subir las imágenes. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="subir-fotos-root">
      <div className="subir-fotos-container">
        <div className="subir-fotos-card">
          <h1 className="subir-fotos-title">Subir Fotos a la Galería</h1>
          <p className="subir-fotos-subtitle">Añade fotos de tu taller y trabajos a tu galería</p>
          
          <form onSubmit={handleSubmit} className="subir-fotos-form">
            {/* Área de Drag & Drop */}
            <div 
              className="drag-drop-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <div className="drag-drop-content">
                <span className="drag-drop-icon">📸</span>
                <h3>Arrastra tus imágenes aquí</h3>
                <p>o haz clic para seleccionar archivos</p>
                <small>Formatos: JPG, PNG, GIF • Máximo 5MB por imagen • Máximo 5 imágenes</small>
              </div>
            </div>

            {/* Input de archivos oculto */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {/* Preview de imágenes seleccionadas */}
            {selectedFiles.length > 0 && (
              <div className="selected-files">
                <h3>Imágenes seleccionadas ({selectedFiles.length}/5)</h3>
                
                <div className="files-grid">
                  {selectedFiles.map((fileObj) => (
                    <div key={fileObj.id} className="file-item">
                      <div className="file-preview">
                        <img src={fileObj.preview} alt={fileObj.name} />
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => removeFile(fileObj.id)}
                          title="Eliminar imagen"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="file-info">
                        <p className="file-name">{fileObj.name}</p>
                        <p className="file-size">
                          {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      
                      <div className="file-actions">
                        <div className="description-input">
                          <label>Descripción (opcional):</label>
                          <textarea
                            placeholder="Describe esta imagen..."
                            value={descriptions[fileObj.id] || ''}
                            onChange={(e) => handleDescriptionChange(fileObj.id, e.target.value)}
                            maxLength="500"
                            rows="3"
                          />
                        </div>
                        
                        <div className="principal-checkbox">
                          <label>
                            <input
                              type="checkbox"
                              checked={principalImage === fileObj.id}
                              onChange={() => handlePrincipalChange(fileObj.id)}
                            />
                            <span>Establecer como foto principal</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensajes de error */}
            {errores.length > 0 && (
              <div className="subir-fotos-msg error-msg">
                <h3>Errores de validación:</h3>
                <ul>
                  {errores.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mensaje de éxito */}
            {msg && <div className="subir-fotos-msg">{msg}</div>}

            {/* Botones de acción */}
            <div className="form-actions">
              <Link to="/gestionar-galeria" className="cancel-btn">
                Cancelar
              </Link>
              <button 
                type="submit" 
                className="subir-fotos-btn"
                disabled={isSubmitting || selectedFiles.length === 0}
              >
                {isSubmitting ? 'Subiendo...' : 'Subir Imágenes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 