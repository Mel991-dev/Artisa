import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardArtesano.css';

export default function DashboardArtesano() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      // Por ahora usamos id_artesano = 1 (después vendrá del token)
      const response = await axios.get('http://localhost:3000/api/productos/artesano/1');
      setProductos(response.data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setMsg('Error al cargar los productos. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarProducto = async (id_producto) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/productos/${id_producto}`);
      setMsg('Producto eliminado correctamente.');
      // Recargar productos
      cargarProductos();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setMsg('Error al eliminar el producto. Inténtalo de nuevo.');
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(precio);
  };

  if (isLoading) {
    return (
      <div className="dashboard-artesano-root">
        <div className="dashboard-artesano-container">
          <div className="dashboard-artesano-header-row">
            <h1 className="dashboard-artesano-title">Gestión de Productos</h1>
            <Link to="/crear-producto" className="dashboard-artesano-add-btn">
              + Añadir Producto
            </Link>
          </div>
          <div className="dashboard-artesano-table-wrapper">
            <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
              Cargando productos...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-artesano-root">
      <div className="dashboard-artesano-container">
        <div className="dashboard-artesano-header-row">
          <h1 className="dashboard-artesano-title">Gestión de Productos</h1>
          <div style={{display: 'flex', gap: '1rem'}}>
            <Link to="/gestionar-galeria" className="dashboard-artesano-add-btn" style={{background: '#92400E'}}>
              📸 Galería
            </Link>
            <Link to="/crear-producto" className="dashboard-artesano-add-btn">
              + Añadir Producto
            </Link>
          </div>
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

        <div className="dashboard-artesano-table-wrapper">
          <table className="dashboard-artesano-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', color: '#666', padding: '2rem'}}>
                    No hay productos registrados aún. 
                    <br />
                    <Link to="/crear-producto" style={{color: '#EF6210', textDecoration: 'none'}}>
                      Crea tu primer producto
                    </Link>
                  </td>
                </tr>
              ) : (
                productos.map(producto => (
                  <tr key={producto.id_producto}>
                    <td>{producto.nombre}</td>
                    <td>
                      {producto.descripcion && producto.descripcion.length > 50 
                        ? `${producto.descripcion.substring(0, 50)}...` 
                        : producto.descripcion}
                    </td>
                    <td>{formatearPrecio(producto.precio)}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: producto.stock > 0 ? '#d4edda' : '#f8d7da',
                        color: producto.stock > 0 ? '#155724' : '#721c24',
                        fontSize: '0.9rem'
                      }}>
                        {producto.stock}
                      </span>
                    </td>
                    <td>{producto.categoria_nombre || 'Sin categoría'}</td>
                    <td>
                      {producto.imagen ? (
                        <img 
                          src={`http://localhost:3000${producto.imagen}`} 
                          alt={producto.nombre}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                      ) : (
                        <span style={{color: '#999', fontSize: '0.9rem'}}>Sin imagen</span>
                      )}
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button
                          onClick={() => navigate(`/editar-producto/${producto.id_producto}`)}
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
                          onClick={() => eliminarProducto(producto.id_producto)}
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
      </div>
    </div>
  );
} 