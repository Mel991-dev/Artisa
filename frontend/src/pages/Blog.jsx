// Blog.jsx

import React, { useEffect, useState } from 'react';
import './Blog.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Blog() {
  const [articulos, setArticulos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        // Ruta pendiente de crear en el backend
        const response = await axios.get('http://localhost:3000/api/blog/articulos');
        setArticulos(response.data);
      } catch (err) {
        setError('No se pudieron cargar los artículos.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticulos();
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="header-title">Cargando artículos...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="header-title">{error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="header-title">Explora nuestros artículos ({articulos.length})</h1>
        <Link to="/crear-articulo">
          <button className="crear-articulo-btn" style={{ marginTop: '18px', marginBottom: '8px', background: '#f0650e', color: 'white', fontWeight: 'bold', fontSize: '1rem', padding: '12px 28px', border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            📝 Crear Artículo
          </button>
        </Link>
      </div>

      <div className="articles-grid">
        {articulos.map((articulo) => (
          <article key={articulo.id_post} className="article-card">
            <div className="article-image">
              {/* Mostrar imagen si existe */}
              {articulo.imagen_blog && (
                <img
                  src={`http://localhost:3000/uploads/blog/${articulo.imagen_blog}`}
                  alt={articulo.titulo}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
            </div>
            <div className="article-content">
              <h2 className="article-title">{articulo.titulo}</h2>
              <div className="article-meta">
                <div className="author-info">
                  <div className="author-icon">👤</div>
                  <span className="author-name">{articulo.autor}</span>
                </div>
                <span className="publish-date">
                  {articulo.fecha_publicacion
                    ? new Date(articulo.fecha_publicacion).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Sin fecha'}
                </span>
              </div>
              <Link to={`/articulo/${articulo.id_post}`}> <button className="read-more-btn">Leer Más &gt;</button></Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Blog;
