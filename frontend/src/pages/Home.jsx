import React from "react";
import "./Home.css";

const Home = () => (
  <>
    {/* Hero Section */}
    <section
      className="hero"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/img/homepage.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="hero-content">
        <h1>Descubre la historia detrás de cada artesanía</h1>
        <p>Conectamos artesanos talentosos con personas que valoran el trabajo hecho a mano</p>
        <a href="/catalogo-productos" className="cta-button">Explorar Productos</a>
      </div>
    </section>

    {/* Categories Section */}
    <section className="categories">
      <div className="container">
        <h2 className="section-title">Explora Por Categorías</h2>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-icon">💍</div>
            <h3>Joyería</h3>
            <a href="/catalogo-productos?categoria=Joyería" className="category-button">Ver Productos &gt;</a>
          </div>
          <div className="category-card">
            <div className="category-icon">🏺</div>
            <h3>Cerámica</h3>
            <a href="/catalogo-productos?categoria=Cerámica" className="category-button">Ver Productos &gt;</a>
          </div>
          <div className="category-card">
            <div className="category-icon">🧶</div>
            <h3>Textiles</h3>
            <a href="/catalogo-productos?categoria=Textiles" className="category-button">Ver Productos &gt;</a>
          </div>
        </div>
      </div>
    </section>

    {/* Artisan Stories Section */}
    <section className="stories">
      <div className="container">
        <h2 className="section-title">Historias de Nuestros Artesanos</h2>
        <div className="stories-grid">
          <div className="story-card">
            <div className="story-avatar"></div>
            <div className="story-content">
              <h4>María González</h4>
              <p className="story-specialty">Joyería en Plata</p>
              <p className="story-text">"Llevo 25 años trabajando la plata con técnicas ancestrales que aprendí de mi abuela. Cada pieza cuenta una historia única de nuestra cultura."</p>
            </div>
          </div>
          <div className="story-card">
            <div className="story-avatar"></div>
            <div className="story-content">
              <h4>Carlos Mendoza</h4>
              <p className="story-specialty">Cerámica Tradicional</p>
              <p className="story-text">"El barro es mi lienzo. Cada vasija que creo lleva el alma de nuestra tierra y las técnicas que han pasado de generación en generación."</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials Section */}
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">Lo que Dicen Nuestros Clientes</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
            <p className="testimonial-text">"Compré una hermosa cerámica. La calidad es excepcional y llegó perfectamente empacada."</p>
            <p className="testimonial-author">- Laura Pérez</p>
          </div>
          <div className="testimonial-card">
            <div className="stars">
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
              <span className="star">★</span>
            </div>
            <p className="testimonial-text">"Me encanta apoyar a los artesanos locales. Artisa hace que sea muy fácil encontrar productos únicos."</p>
            <p className="testimonial-author">- Roberto Silva</p>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Home;
