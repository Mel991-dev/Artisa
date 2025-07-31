import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardArtesano.css';

/*
-------------------------------------------------------------
DOCUMENTACIÓN: LÓGICA DE MANEJO DE IMÁGENES EN DASHBOARD ARTESANO
-------------------------------------------------------------

1. Problema detectado:
- El campo 'imagen' en la base de datos puede contener la ruta completa o solo el nombre de archivo.
- El frontend construía la URL concatenando la ruta base y el campo 'imagen', lo que podía duplicar la ruta y causar errores 404.
- Esto provocaba que las imágenes reales no se mostraran y se usara el fallback 'product-default.svg'.

2. Solución aplicada:
- Se creó la función extraerNombreArchivo(ruta) para obtener solo el nombre de archivo, sin importar si el campo contiene la ruta completa o parcial.
- Al construir la URL de la imagen, se usa:
    src={`http://localhost:3000/uploads/productos/${extraerNombreArchivo(producto.imagen)}`}
- Así, la URL siempre apunta correctamente al archivo real en la carpeta backend/uploads/productos/.

3. Recomendaciones para futuros desarrollos:
- Guardar en la base de datos solo el nombre de archivo, nunca la ruta completa.
- El backend debe servir la carpeta de archivos estáticos con Express usando una ruta clara (/uploads).
- El frontend debe construir la URL concatenando la ruta base y el nombre de archivo, usando la función extraerNombreArchivo si es necesario.
- Usar una imagen por defecto si la imagen real no existe o falla la carga.

4. Beneficios:
- Evita errores de duplicación de rutas y 404.
- Hace el código más mantenible y predecible.
- Permite cambiar la estructura de carpetas sin modificar la base de datos.
- Facilita el manejo de imágenes y otros archivos estáticos en todo el proyecto.
-------------------------------------------------------------
*/

export default function DashboardArtesano() {
  const [productos, setProductos] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' o 'articulos'
  const navigate = useNavigate();

  // Cargar productos y artículos al montar el componente
  useEffect(() => {
    cargarProductos();
    cargarArticulos();
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

  const cargarArticulos = async () => {
    try {
      // Por ahora usamos id_usuario = 1 (después vendrá del token)
      const response = await axios.get('http://localhost:3000/api/blog/articulos/usuario/1');
      setArticulos(response.data);
    } catch (err) {
      console.error('Error al cargar artículos:', err);
      setMsg('Error al cargar los artículos. Inténtalo de nuevo.');
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

  const eliminarArticulo = async (id_post) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/blog/articulos/${id_post}`);
      setMsg('Artículo eliminado correctamente.');
      // Recargar artículos
      cargarArticulos();
    } catch (err) {
      console.error('Error al eliminar artículo:', err);
      setMsg('Error al eliminar el artículo. Inténtalo de nuevo.');
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(precio);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Función para extraer solo el nombre de archivo de la imagen
  function extraerNombreArchivo(ruta) {
    if (!ruta) return '';
    const partes = ruta.split('/');
    return partes[partes.length - 1];
  }

  // Función para limpiar contenido de errores y formatear texto
  function limpiarContenido(contenido) {
    if (!contenido) return '';
    
    // Remover errores de archivo
    let textoLimpio = contenido.replace(/Error: Error: ENOENT:.*?\.\.\./g, '');
    textoLimpio = textoLimpio.replace(/Error:.*?\.\.\./g, '');
    
    // Remover caracteres aleatorios al inicio
    textoLimpio = textoLimpio.replace(/^[a-z]{10,}/i, '');
    
    // Si el contenido está muy corto después de limpiar, usar el original
    if (textoLimpio.trim().length < 10) {
      return contenido;
    }
    
    return textoLimpio.trim();
  }

  if (isLoading) {
    return (
      <div className="dashboard-artesano-root">
        <div className="dashboard-artesano-container">
          <div className="dashboard-artesano-header-row">
            <h1 className="dashboard-artesano-title">Dashboard Artesano</h1>
          </div>
          <div className="dashboard-artesano-table-wrapper">
            <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
              Cargando contenido...
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
          <h1 className="dashboard-artesano-title">Dashboard Artesano</h1>
          <div style={{display: 'flex', gap: '1rem'}}>
            <Link to="/gestionar-galeria" className="dashboard-artesano-add-btn" style={{background: '#92400E'}}>
              📸 Galería
            </Link>
            {activeTab === 'productos' ? (
              <Link to="/crear-producto" className="dashboard-artesano-add-btn">
                + Añadir Producto
              </Link>
            ) : (
              <Link to="/crear-articulo" className="dashboard-artesano-add-btn">
                + Crear Artículo
              </Link>
            )}
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            📦 Productos ({productos.length})
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'articulos' ? 'active' : ''}`}
            onClick={() => setActiveTab('articulos')}
          >
            📝 Artículos ({articulos.length})
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

        {/* Contenido de Productos */}
        {activeTab === 'productos' && (
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
                            src={`http://localhost:3000/uploads/productos/${extraerNombreArchivo(producto.imagen)}`}
                            alt={producto.nombre}
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/img/product-default.svg';
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
        )}

        {/* Contenido de Artículos */}
        {activeTab === 'articulos' && (
          <div className="dashboard-artesano-table-wrapper">
            <table className="dashboard-artesano-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Contenido</th>
                  <th>Fecha de Publicación</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {articulos.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', color: '#666', padding: '2rem'}}>
                      No hay artículos creados aún. 
                      <br />
                      <Link to="/crear-articulo" style={{color: '#EF6210', textDecoration: 'none'}}>
                        Crea tu primer artículo
                      </Link>
                    </td>
                  </tr>
                ) : (
                  articulos.map(articulo => (
                    <tr key={articulo.id_post}>
                      <td className="table-cell-title">
                        <div className="cell-content">
                          {articulo.titulo}
                        </div>
                      </td>
                      <td className="table-cell-content">
                        <div className="cell-content">
                          {(() => {
                            const contenidoLimpio = limpiarContenido(articulo.contenido);
                            return contenidoLimpio && contenidoLimpio.length > 100 
                              ? `${contenidoLimpio.substring(0, 100)}...` 
                              : contenidoLimpio;
                          })()}
                        </div>
                      </td>
                      <td className="table-cell-date">
                        <div className="cell-content">
                          {formatearFecha(articulo.fecha_publicacion)}
                        </div>
                      </td>
                      <td className="table-cell-image">
                        {articulo.imagen_blog ? (
                          <img 
                            src={`http://localhost:3000/uploads/blog/${extraerNombreArchivo(articulo.imagen_blog)}`}
                            alt={articulo.titulo}
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/img/product-default.svg';
                            }}
                          />
                        ) : (
                          <span style={{color: '#999', fontSize: '0.9rem'}}>Sin imagen</span>
                        )}
                      </td>
                      <td className="table-cell-actions">
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <button
                            onClick={() => navigate(`/editar-articulo/${articulo.id_post}`)}
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
                            onClick={() => eliminarArticulo(articulo.id_post)}
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