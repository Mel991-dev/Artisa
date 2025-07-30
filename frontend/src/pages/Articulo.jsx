
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Articulo.css";

const Articulo = () => {
  const { id_post } = useParams();
  const [articulo, setArticulo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticulo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/blog/articulos/${id_post}`);
        setArticulo(response.data);
      } catch (err) {
        setError("No se pudo cargar el artículo.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticulo();
  }, [id_post]);

  if (isLoading) {
    return <div className="article-container"><h2>Cargando artículo...</h2></div>;
  }
  if (error || !articulo) {
    return <div className="article-container"><h2>{error || "Artículo no encontrado."}</h2></div>;
  }

  return (
    <div className="article-container">
      <header className="article-header">
        <h1 className="article-title">{articulo.titulo}</h1>
        <div className="article-meta">
          <div className="author-info">
            <div className="author-avatar">{articulo.autor?.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
            <span className="author-name">{articulo.autor}</span>
          </div>
          <div className="meta-divider"></div>
          <span className="publish-date">{articulo.fecha_publicacion ? new Date(articulo.fecha_publicacion).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sin fecha'}</span>
        </div>
      </header>

      <div className="article-image">
        {articulo.imagen_blog && (
          <img src={`http://localhost:3000/uploads/blog/${articulo.imagen_blog}`} alt={articulo.titulo} style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: '12px' }} />
        )}
      </div>

      <main className="article-content">
        <p>{articulo.contenido}</p>
      </main>
    </div>
  );
};

export default Articulo;
