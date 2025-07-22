import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CrearProducto.css';

export default function CrearProducto() {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    id_categoria: ''
  });
  
  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [msg, setMsg] = useState('');
  const [errores, setErrores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar categorías al montar el componente
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/productos/categorias');
      setCategorias(response.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setMsg('Error al cargar las categorías. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Limpiar errores cuando el usuario empiece a escribir
    if (errores.length > 0) {
      setErrores([]);
      setMsg('');
    }
  };

  const handleImagenChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImagen(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrores([]);
    setMsg('');
    
    try {
      // Crear FormData para enviar archivo + datos
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('descripcion', form.descripcion);
      formData.append('precio', form.precio);
      formData.append('stock', form.stock);
      formData.append('id_categoria', form.id_categoria);
      formData.append('id_artesano', '1'); // Por ahora fijo
      
      // Agregar imagen si se seleccionó
      if (imagen) {
        formData.append('imagen', imagen);
      }

      console.log('Enviando datos del producto con imagen...');
      
      const response = await axios.post('http://localhost:3000/api/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMsg('¡Producto creado exitosamente!');
      
      // Limpiar formulario
      setForm({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        id_categoria: ''
      });
      setImagen(null);
      setPreviewImagen(null);
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard-artesano');
      }, 2000);
      
    } catch (err) {
      console.error('Error al crear producto:', err);
      
      // Manejar errores de validación del backend
      if (err.response?.data?.errores) {
        setErrores(err.response.data.errores);
      } else {
        setMsg(err.response?.data?.msg || 'Error al crear el producto. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="crear-producto-container">
        <div className="crear-producto-card">
          <h1 className="crear-producto-title">Cargando...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="crear-producto-container">
      <div className="crear-producto-card">
        <h1 className="crear-producto-title">Crear Nuevo Producto</h1>
        <p className="crear-producto-subtitle">Añade un nuevo producto a tu catálogo artesanal</p>
        
        <form onSubmit={handleSubmit} className="crear-producto-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Producto *</label>
            <div className="input-with-icon">
              <span className="input-icon">🏷️</span>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej: Pulsera de plata con detalles"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <div className="input-with-icon">
              <span className="input-icon">📝</span>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe tu producto, materiales, técnicas utilizadas..."
                value={form.descripcion}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="precio">Precio (COP) *</label>
              <div className="input-with-icon">
                <span className="input-icon">💰</span>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  placeholder="0"
                  value={form.precio}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Disponible *</label>
              <div className="input-with-icon">
                <span className="input-icon">📦</span>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="id_categoria">Categoría *</label>
            <div className="input-with-icon">
              <span className="input-icon">🏷️</span>
              <select
                id="id_categoria"
                name="id_categoria"
                value={form.id_categoria}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imagen">Imagen del Producto</label>
            <div className="input-with-icon">
              <span className="input-icon">🖼️</span>
              <input
                id="imagen"
                name="imagen"
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
              />
            </div>
            <small className="form-help">Selecciona una imagen de tu producto (JPG, PNG, GIF - máximo 5MB)</small>
            
            {previewImagen && (
              <div className="imagen-preview">
                <img 
                  src={previewImagen} 
                  alt="Vista previa" 
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginTop: '10px'
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <Link to="/dashboard-artesano" className="cancel-btn">
              Cancelar
            </Link>
            <button 
              type="submit" 
              className="crear-producto-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>

        {msg && <div className="crear-producto-msg">{msg}</div>}
        {errores.length > 0 && (
          <div className="crear-producto-msg error-msg">
            <h3>Errores de validación:</h3>
            <ul>
              {errores.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 