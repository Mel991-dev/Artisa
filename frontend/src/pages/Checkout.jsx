// Checkout.jsx
import React, { useState } from 'react';
import './Checkout.css';

const metodosPago = [
  { id: 1, nombre: 'Tarjeta de Crédito/Débito', descripcion: 'Aceptamos Visa, MasterCard y American Express.' },
  { id: 2, nombre: 'PayPal', descripcion: 'Serás redirigido a PayPal para completar el pago.' },
  { id: 3, nombre: 'Nequi', descripcion: 'Te enviaremos un enlace de pago a tu número registrado en Nequi.' },
  { id: 4, nombre: 'Daviplata', descripcion: 'Recibirás instrucciones vía mensaje de texto.' },
  { id: 5, nombre: 'PSE', descripcion: 'Realiza el pago desde tu banco en línea con PSE.' },
];

const productos = [
  { id: 1, nombre: 'Collar de Plata Artesanal', autor: 'María González', cantidad: 1, precio: 45000 },
  { id: 2, nombre: 'Aretes de Filigrana', autor: 'María González', cantidad: 2, precio: 32000 },
];

function Checkout() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    pais: '',
    metodoPago: 5,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleMetodoChange = (idMetodo) => {
    setFormData((prev) => ({ ...prev, metodoPago: idMetodo }));
  };

  const confirmarCompra = () => {
    alert('Compra confirmada. Esta información no se enviará aún.');
    console.log('Datos simulados:', formData);
  };

  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const envio = 8000;
  const total = subtotal + envio;

  return (
    <div className="checkout-container">
      <div className="checkout-left">
        <div className="checkout-card">
          <h2>Resumen del Pedido</h2>
          {productos.map((p) => (
            <div key={p.id} className="pedido-item">
              <div>
                <strong>{p.nombre}</strong>
                <p>Por: {p.autor}</p>
                <p>Cantidad: {p.cantidad}</p>
              </div>
              <span>${(p.precio * p.cantidad).toLocaleString('es-CO')}</span>
            </div>
          ))}
        </div>

        <div className="checkout-card">
          <h2>Información de Envío</h2>
          <div className="form-grid">
            <input id="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
            <input id="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
          </div>
          <input id="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} />
          <input id="direccion" placeholder="Dirección completa" value={formData.direccion} onChange={handleChange} />
          <input id="pais" placeholder="País" value={formData.pais} onChange={handleChange} />
        </div>

        <div className="checkout-card">
          <h2>Método de Pago</h2>
          {metodosPago.map((m) => (
            <label
              key={m.id}
              className={`pago-opcion ${formData.metodoPago === m.id ? 'seleccionado' : ''}`}
              onClick={() => handleMetodoChange(m.id)}
            >
              <input type="radio" checked={formData.metodoPago === m.id} readOnly />
              <div>
                <div className="nombre-metodo">{m.nombre}</div>
                <div className="descripcion-metodo">{m.descripcion}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="checkout-right">
        <h3>Total del Pedido</h3>
        <div className="resumen-linea">
          <span>Subtotal:</span>
          <span>${subtotal.toLocaleString('es-CO')}</span>
        </div>
        <div className="resumen-linea">
          <span>Envío:</span>
          <span>${envio.toLocaleString('es-CO')}</span>
        </div>
        <div className="resumen-total">
          <span>Total:</span>
          <span>${total.toLocaleString('es-CO')}</span>
        </div>

        <button className="btn-confirmar" onClick={confirmarCompra}>Confirmar Compra</button>
        <p className="texto-condiciones">
          Al confirmar tu compra, aceptas nuestros <a href="#">términos y condiciones</a>.
        </p>
      </div>
    </div>
  );
}

export default Checkout;
