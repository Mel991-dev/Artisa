import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './CrearProducto.css';

export default function EditarProducto() {
  const { id_producto } = useParams();
  const navigate = useNavigate();
  
  console.log('ID del producto recibido:', id_producto);
  
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    id_categoria: ''
  });
  
  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [msg, setMsg] = useState('');
  const [errores, setErrores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del producto y categorías al montar el componente
  useEffect(() => {
    cargarDatos();
  }, [id_producto]);

  const cargarDatos = async () => {
    try {
      console.log('Cargando datos para producto ID:', id_producto);
      
      // Cargar categorías
      const categoriasResponse = await axios.get('http://localhost:3000/api/productos/categorias');
      setCategorias(categoriasResponse.data);

      // Cargar datos del producto
      const productoResponse = await axios.get(`http://localhost:3000/api/productos/${id_producto}`);
      const producto = productoResponse.data;
      
      console.log('Datos del producto cargados:', producto);

      // Llenar formulario con datos existentes
      setForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        stock: producto.stock || '',
        id_categoria: producto.id_categoria || ''
      });

      // Mostrar imagen actual si existe
      if (producto.imagen) {
        setImagenActual(`http://localhost:3000${producto.imagen}`);
      }

    } catch (err) {
      console.error('Error al cargar datos:', err);
      setMsg('Error al cargar los datos del producto. Inténtalo de nuevo.');
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
      
      // Agregar imagen si se seleccionó una nueva
      if (imagen) {
        formData.append('imagen', imagen);
      }

      console.log('Actualizando producto...');
      
      const response = await axios.put(`http://localhost:3000/api/productos/${id_producto}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMsg('¡Producto actualizado exitosamente!');
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard-artesano');
      }, 2000);
      
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      
      // Manejar errores de validación del backend
      if (err.response?.data?.errores) {
        setErrores(err.response.data.errores);
      } else {
        setMsg(err.response?.data?.msg || 'Error al actualizar el producto. Inténtalo de nuevo.');
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
        <h1 className="crear-producto-title">Editar Producto</h1>
        <p className="crear-producto-subtitle">Modifica los datos de tu producto artesanal</p>
        
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
            <small className="form-help">Selecciona una nueva imagen o deja vacío para mantener la actual</small>
            
            {/* Mostrar imagen actual */}
            {imagenActual && !previewImagen && (
              <div className="imagen-preview">
                <p style={{margin: '10px 0 5px 0', fontSize: '0.9rem', color: '#666'}}>Imagen actual:</p>
                <img 
                  src={imagenActual} 
                  alt="Imagen actual" 
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #EF6210'
                  }}
                />
              </div>
            )}
            
            {/* Mostrar preview de nueva imagen */}
            {previewImagen && (
              <div className="imagen-preview">
                <p style={{margin: '10px 0 5px 0', fontSize: '0.9rem', color: '#666'}}>Nueva imagen:</p>
                <img 
                  src={previewImagen} 
                  alt="Vista previa" 
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #28a745'
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
              {isSubmitting ? 'Actualizando...' : 'Actualizar Producto'}
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