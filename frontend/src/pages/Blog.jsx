// Blog.jsx
import React from 'react';
import './Blog.css';
import { Link } from 'react-router-dom';

const articulos = [
  {
    id: 1,
    titulo: 'La Tradición de la Filigrana en Colombia',
    resumen: 'Descubre cómo esta técnica ancestral de joyería ha pasado de generación en generación...',
    autor: 'María González',
    fecha: '2024-11-15'
  },
  {
    id: 2,
    titulo: 'El Impacto Social del Comercio Artesanal',
    resumen: 'Conoce cómo la compra de productos artesanales contribuye al desarrollo económico...',
    autor: 'Carlos Mendoza',
    fecha: '2024-11-12'
  },
  {
    id: 3,
    titulo: 'Historia de los Textiles Wayuu',
    resumen: 'Un viaje a través del tiempo para entender el significado cultural de los textiles...',
    autor: 'Ana Rodríguez',
    fecha: '2024-11-08'
  },
  {
    id: 4,
    titulo: 'Técnicas Ancestrales de Cerámica Precolombina',
    resumen: 'Explora las técnicas milenarias que aún utilizan los ceramistas colombianos...',
    autor: 'Diego Herrera',
    fecha: '2024-11-05'
  },
  {
    id: 5,
    titulo: 'El Arte del Tejido en Telar Tradicional',
    resumen: 'Descubre los secretos detrás de la elaboración de textiles en telar tradicional...',
    autor: 'Carmen Silva',
    fecha: '2024-11-02'
  },
  {
    id: 6,
    titulo: 'Sostenibilidad en la Artesanía Moderna',
    resumen: 'Cómo los artesanos contemporáneos están adoptando prácticas sostenibles...',
    autor: 'Luis Martínez',
    fecha: '2024-10-28'
  }
];

function Blog() {
  return (
    <div className="container">
      <div className="header">
        <h1 className="header-title">Explora nuestros artículos ({articulos.length})</h1>
      </div>

      <div className="articles-grid">
        {articulos.map((articulo) => (
          <article key={articulo.id} className="article-card">
            <div className="article-image"></div>
            <div className="article-content">
              <h2 className="article-title">{articulo.titulo}</h2>
              <p className="article-excerpt">{articulo.resumen}</p>
              <div className="article-meta">
                <div className="author-info">
                  <div className="author-icon">👤</div>
                  <span className="author-name">{articulo.autor}</span>
                </div>
                <span className="publish-date">{new Date(articulo.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <Link to="/articulo"> <button className="read-more-btn">Leer Más &gt;</button></Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Blog;
