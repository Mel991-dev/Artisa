import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Artisa</h3>
          <p>Conectando artesanos con el mundo, preservando tradiciones y creando oportunidades.</p>
        </div>
        <div className="footer-section">
          <h3>Contacto</h3>
          <div className="contact-item email">
            <span>info@artisa.com</span>
          </div>
          <div className="contact-item phone">
            <span>+57 300 123 4567</span>
          </div>
          <div className="contact-item location">
            <span>Bogotá, Colombia</span>
          </div>
        </div>
        <div className="footer-section">
          <h3>Legal</h3>
          <a href="#terms">Términos y Condiciones</a>
          <a href="#privacy">Política de Privacidad</a>
          <a href="#returns">Política de Devoluciones</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">© 2024 Artisa. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
