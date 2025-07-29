import React from "react";
import "./Articulo.css";

const Articulo = () => {
  return (
    <div className="article-container">
      <header className="article-header">
        <h1 className="article-title">Mi Experiencia Aprendiendo Cerámica Tradicional</h1>
        <div className="article-meta">
          <div className="author-info">
            <div className="author-avatar">MG</div>
            <span className="author-name">María González</span>
          </div>
          <div className="meta-divider"></div>
          <span className="publish-date">15 de Noviembre, 2024</span>
        </div>
      </header>

      <div className="article-image"></div>

      <main className="article-content">
        <p>
          La primera técnica que dominé fue el <strong>modelado a mano</strong>. Mi abuela me enseñó
          que cada pieza debe nacer del corazón, no solo de las manos...
        </p>

        <h2>Materiales Básicos</h2>
        <p>
          ...mi maestra me demostró que la verdadera cerámica tradicional se basa en elementos simples:
        </p>
        <ul>
          <li><strong>Arcilla de buena calidad:</strong> Preferiblemente extraída localmente</li>
          <li><strong>Herramientas de modelado:</strong> Cucharas, piedras lisas...</li>
          <li><strong>Agua:</strong> Vital para controlar la humedad</li>
          <li><strong>Paciencia y dedicación:</strong> Los ingredientes más importantes</li>
        </ul>

        <h2>El Impacto en Mi Vida</h2>
        <p>...Cada pieza cuenta una historia transmitida durante siglos...</p>

        <h3>Desafíos Superados</h3>
        <p>...Lloré, pero mi abuela me dijo que <strong>cada fracaso es una lección disfrazada</strong>.</p>

        <h3>Técnicas Ancestrales que Aún Uso</h3>
        <p>
          Entre las técnicas más valiosas está el <strong>bruñido con piedra</strong> y la
          <strong> cocción en horno de leña</strong>.
        </p>

        <h2>Consejos para Nuevos Artesanos</h2>
        <p><strong>Encuentra un mentor:</strong> Aprende de quienes han preservado el arte.</p>
        <p><strong>Practica la paciencia:</strong> Cada etapa tiene su tiempo.</p>
        <p><strong>Conecta con tu comunidad:</strong> Participa e intercambia saberes.</p>

        <h3>El Futuro de Nuestras Tradiciones</h3>
        <p>
          ...Mi compromiso es enseñar y preservar. Cada estudiante es portador de nuestra herencia...
        </p>
      </main>

      <section className="related-articles-section">
        <h2 className="related-articles-title">Más artículos para leer</h2>
        <div className="related-articles-grid">
          <article className="related-article-card">
            <div className="related-article-image"></div>
            <div className="related-article-content">
              <h3 className="related-article-title">El Impacto Social del Comercio Artesanal</h3>
              <div className="related-article-meta">Carlos Mendoza • 6 min</div>
              <button className="related-read-btn">Leer Artículo</button>
            </div>
          </article>
          <article className="related-article-card">
            <div className="related-article-image"></div>
            <div className="related-article-content">
              <h3 className="related-article-title">Historia de los Textiles Wayuu</h3>
              <div className="related-article-meta">Ana Rodríguez • 8 min</div>
              <button className="related-read-btn">Leer Artículo</button>
            </div>
          </article>
          <article className="related-article-card">
            <div className="related-article-image"></div>
            <div className="related-article-content">
              <h3 className="related-article-title">Técnicas de Cerámica Precolombina</h3>
              <div className="related-article-meta">Diego Herrera • 8 min</div>
              <button className="related-read-btn">Leer Artículo</button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Articulo;
