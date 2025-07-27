// Carrito.jsx
import React, { useState } from 'react';
import './Carrito.css';

const productosIniciales = [
  {
    id: 1,
    nombre: 'Collar de Plata Artesanal',
    autor: 'María González',
    precio: 45000,
    cantidad: 1,
    stock: 12
  },
  {
    id: 2,
    nombre: 'Aretes de Filigrana',
    autor: 'María González',
    precio: 32000,
    cantidad: 2,
    stock: 8
  },
  {
    id: 3,
    nombre: 'Vasija de Barro Tradicional',
    autor: 'Carlos Mendoza',
    precio: 28000,
    cantidad: 1,
    stock: 5
  }
];

function Carrito() {
  const [productos, setProductos] = useState(productosIniciales);

  const cambiarCantidad = (id, delta) => {
    setProductos(productos.map(p => {
      if (p.id === id) {
        const nuevaCantidad = Math.max(1, Math.min(p.stock, p.cantidad + delta));
        return { ...p, cantidad: nuevaCantidad };
      }
      return p;
    }));
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <div className="container">
      <div className="cart-header">
        <h1 className="cart-title">
          <span className="cart-icon">🛒</span>
          Mi Carrito ({productos.length} productos)
        </h1>
      </div>

      <div className="cart-content">
        <div className="products-section">
          {productos.map((p) => (
            <div key={p.id} className="product-item">
              <div className="product-image"></div>
              <div className="product-details">
                <h3 className="product-name">{p.nombre}</h3>
                <p className="product-author">Por: {p.autor}</p>
                <p className="product-price">${p.precio.toLocaleString('es-CO')}</p>
              </div>
              <div className="quantity-controls">
                <span className="quantity-label">Cantidad:</span>
                <div className="quantity-section">
                  <button className="quantity-btn" onClick={() => cambiarCantidad(p.id, -1)}>−</button>
                  <input type="text" className="quantity-input" value={p.cantidad} readOnly />
                  <button className="quantity-btn" onClick={() => cambiarCantidad(p.id, 1)}>+</button>
                </div>
                <div className="stock-info">({p.stock} disponibles)</div>
                <div className="total-price">${(p.precio * p.cantidad).toLocaleString('es-CO')}</div>
                <button className="delete-btn" onClick={() => eliminarProducto(p.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        <div className="summary-section">
          <h2 className="summary-title">Resumen de Compra</h2>

          <div className="summary-row">
            <span className="summary-label">Subtotal:</span>
            <span className="summary-value">${subtotal.toLocaleString('es-CO')}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Envío:</span>
            <span className="free-shipping">¡Gratis!</span>
          </div>

          <div className="shipping-note">
            <span>🚚</span>
            <span>Envío gratis por compras mayores a $100.000</span>
          </div>

          <div className="total-section">
            <div className="total-row">
              <span>Total:</span>
              <span>${subtotal.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <div className="benefits-list">
            <div className="benefit-item"><span className="benefit-icon">✓</span><span>Compra 100% segura</span></div>
            <div className="benefit-item"><span className="benefit-icon">📦</span><span>Envío en 3-5 días hábiles</span></div>
            <div className="benefit-item"><span className="benefit-icon">❤️</span><span>Empaque especial incluido</span></div>
          </div>

          <button className="checkout-btn">💳 Proceder al Pago</button>
          <button className="continue-btn">Seguir Comprando</button>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
