import React from 'react';
import './ConfirmacionPago.css';

const ConfirmacionPago = ({ datos = {} }) => {
  const {
    numeroOrden = '',
    datosComprador = {},
    datosEnvio = {},
    productos = [],
    pago = {},
    resumen = {},
  } = datos;

  return (
    <div className="container">
      <div className="success-banner">
        <div className="checkmark">✓</div>
        <h1 className="success-title">¡Compra Confirmada!</h1>
        <p className="success-subtitle">Tu pedido ha sido procesado exitosamente</p>
        <p className="order-number">Número de orden: <strong>{numeroOrden}</strong></p>
      </div>

      <div className="invoice">
        <div className="invoice-header">
          <div>
            <h2 className="invoice-title">FACTURA DE COMPRA</h2>
            <p>Artisa - Marketplace Artesanal</p>
          </div>
          <div className="invoice-details">
            <p><strong>{numeroOrden}</strong></p>
            <p>{datosEnvio.fecha || 'Fecha no disponible'}</p>
          </div>
        </div>

        <div className="invoice-body">
          <div className="info-grid">
            <div className="section">
              <h3 className="section-title">
                <span className="icon">👤</span>
                Datos del Comprador
              </h3>
              <div className="info-item">
                <div className="info-label">Nombre completo:</div>
                <div className="info-value">{datosComprador.nombreCompleto}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Correo electrónico:</div>
                <div className="info-value">{datosComprador.email}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Dirección:</div>
                <div className="info-value">{datosComprador.direccion}</div>
              </div>
              <div className="info-item">
                <div className="info-label">País:</div>
                <div className="info-value">{datosComprador.pais}</div>
              </div>
            </div>

            <div className="section">
              <h3 className="section-title">
                <span className="icon">🚚</span>
                Información de Envío
              </h3>
              <div className="info-item">
                <div className="info-label">Número de seguimiento:</div>
                <div className="info-value">
                  <span className="tracking-number">{datosEnvio.tracking}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Fecha de pedido:</div>
                <div className="info-value">{datosEnvio.fecha}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Estado del envío:</div>
                <div className="info-value">{datosEnvio.estado}</div>
              </div>
            </div>
          </div>

          <div className="section">
            <h3 className="section-title">
              <span className="icon">📦</span>
              Productos Comprados
            </h3>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Artesano</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="product-image"></div>
                        <span>{p.nombre}</span>
                      </div>
                    </td>
                    <td>{p.artesano}</td>
                    <td>{p.cantidad}</td>
                    <td className="price">${p.precio.toLocaleString('es-CO')}</td>
                    <td className="price">${(p.precio * p.cantidad).toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="payment-summary">
            <div className="payment-method">
              <h3 className="section-title">
                <span className="icon">💳</span>
                Información de Pago
              </h3>
              <div className="info-item">
                <div className="info-label">Método de pago:</div>
                <div className="info-value">{pago.metodo}</div>
              </div>
              <div className="info-item">
                <div className="info-label">ID de transacción:</div>
                <div className="info-value">{pago.transaccion}</div>
              </div>
              <div className="success-indicator">
                <span>✓</span>
                <span>Pago Procesado Exitosamente</span>
              </div>
            </div>

            <div className="cost-summary">
              <h3 className="section-title">
                <span className="icon">💰</span>
                Resumen de Costos
              </h3>
              <div className="cost-row">
                <span>Subtotal:</span>
                <span>${resumen.subtotal?.toLocaleString('es-CO')}</span>
              </div>
              <div className="cost-row">
                <span>Envío:</span>
                <span>${resumen.envio?.toLocaleString('es-CO')}</span>
              </div>
              <div className="cost-row total-row">
                <span>TOTAL PAGADO:</span>
                <span>${resumen.total?.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-cards">
        <div className="action-card">
          <div className="action-icon catalog-icon">📦</div>
          <h3 className="action-title">Seguir Comprando</h3>
          <p className="action-description">Descubre más productos únicos</p>
          <a href="#" className="btn btn-primary">Ver Catálogo</a>
        </div>

        <div className="action-card">
          <div className="action-icon tracking-icon">🚚</div>
          <h3 className="action-title">Rastrear Pedido</h3>
          <p className="action-description">Sigue el estado de tu envío</p>
          <a href="#" className="btn btn-outline">Rastrear Envío</a>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionPago;
