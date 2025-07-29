import React, { useState } from 'react';
import './SeguimientoPedido.css';

function SeguimientoPedido() {
  const [tracking, setTracking] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tracking.trim()) {
      alert(`Buscando información para: ${tracking}`);
      // Aquí se simularía la búsqueda de información del pedido.
    }
  };

  return (
    <div className="tracking-page">
      <div className="header-section">
        <div className="package-icon">📦</div>
        <h1 className="header-title">Rastrear Mi Pedido</h1>
        <p className="header-subtitle">
          Ingresa tu número de seguimiento o número de orden para ver el estado de tu envío
        </p>
      </div>

      <div className="container">
        <div className="search-card">
          <h2 className="search-title">Buscar Pedido</h2>
          <form className="search-form" onSubmit={handleSubmit}>
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Ingresa tu número de seguimiento o número de orden"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="search-btn">Rastrear</button>
          </form>

          <div className="example-section">
            <div className="example-label">Ejemplo:</div>
            <div className="example-codes">TRK789456123 o ART-2024-001247</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeguimientoPedido;
