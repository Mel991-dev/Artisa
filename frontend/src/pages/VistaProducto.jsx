// Componente VistaProducto.jsx actualizado con funcionalidad de validación de reseñas

import React, { useState } from 'react';
import './VistaProducto.css';
import { Link } from 'react-router-dom';

const VistaProducto = () => {
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'error' o 'exito'

  const manejarClickEstrella = (valor) => {
    setCalificacion(valor);
  };

  const manejarPublicarReseña = () => {
    if (calificacion === 0) {
      setMensaje('Por favor selecciona una calificación con estrellas.');
      setTipoMensaje('error');
      return;
    }

    if (comentario.trim() === '') {
      setMensaje('Por favor escribe un comentario antes de publicar.');
      setTipoMensaje('error');
      return;
    }

    // Simulación de envío exitoso
    setMensaje('¡Gracias por tu reseña!');
    setTipoMensaje('exito');

    // Limpiar campos
    setComentario('');
    setCalificacion(0);
    setHover(0);
  };

  return (
    <div className="contenedor-detalle-producto">
      {/* Contenedor principal dividido en dos secciones */}
      <div className="contenedor-principal-producto">
        <div className="producto-imagen-galeria">
          <div className="imagen-principal">
            <img src="/camara.png" alt="Imagen Principal" />
          </div>
          <div className="galeria-imagenes">
            <img src="/camara.png" alt="Miniatura 1" />
            <img src="/camara.png" alt="Miniatura 2" />
          </div>
        </div>

        <div className="producto-detalles">
          <h1 className="producto-titulo">Collar de Plata Artesanal</h1>
          <div className="producto-calificacion">
            <span>⭐⭐⭐☆☆</span>
            <span className="total-resenas">(24 reseñas)</span>
          </div>
          <p className="producto-precio">$45.000</p>
          <p className="producto-stock">
            📦 <span>Stock disponible: 8 unidades</span>
          </p>

          <div className="producto-artesano">
            <p className="etiqueta-creado">Creado por:</p>
            <div className="perfil-artesano">
              <div className="avatar">MG</div>
              <div className="info-artesano">
                <p className="nombre-artesano">María González</p>
                <p>Artesana especializada en joyería de plata con técnicas tradicionales colombianas.</p>
              </div>
            </div>
            <Link to="/artesano/1">
              <button className="btn-perfil-artesano">Ver Perfil del Artesano</button>
            </Link>
          </div>

          <button className="btn-agregar-carrito">🛒 Añadir al Carrito</button>
        </div>
      </div>

      {/* Reseñas publicadas */}
      <div className="reseñas-publicadas">
        <h2 className="titulo-reseñas">Reseñas de Clientes (3)</h2>
        <div className="reseña">
          <div className="reseña-cabecera">
            <strong>Laura Pérez</strong>
            <span className="fecha-reseña">15 de Noviembre, 2024</span>
          </div>
          <p className="reseña-calificacion">★★★★★</p>
          <p>Absolutamente hermoso. La calidad es excepcional y se nota el trabajo artesanal. Llegó perfectamente empacado.</p>
        </div>

        <div className="reseña">
          <div className="reseña-cabecera">
            <strong>Roberto Silva</strong>
            <span className="fecha-reseña">10 de Noviembre, 2024</span>
          </div>
          <p className="reseña-calificacion">★★★★★</p>
          <p>Compré este collar para mi esposa y quedó encantada. Es una pieza única y muy bien elaborada.</p>
        </div>

        <div className="reseña">
          <div className="reseña-cabecera">
            <strong>Carmen Rodríguez</strong>
            <span className="fecha-reseña">5 de Noviembre, 2024</span>
          </div>
          <p className="reseña-calificacion">★★★★☆</p>
          <p>Muy bonito collar, aunque tardó un poco más de lo esperado en llegar. Pero vale la pena la espera.</p>
        </div>
      </div>

      {/* Formulario para publicar reseña */}
      <div className="formulario-reseña">
        <h2 className="titulo-reseña">Deja tu Reseña</h2>
        <p className="nota-usuarios">Solo los usuarios que han comprado este producto pueden dejar reseñas</p>

        <label htmlFor="calificacion">Tu Calificación </label>
        <div className="estrellas">
          {[1, 2, 3, 4, 5].map((valor) => (
            <span
              key={valor}
              className="estrella"
              onClick={() => manejarClickEstrella(valor)}
              onMouseEnter={() => setHover(valor)}
              onMouseLeave={() => setHover(0)}
              style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: valor <= (hover || calificacion) ? '#ffc107' : '#ccc'
              }}
            >
              ★
            </span>
          ))}
        </div>

        <label htmlFor="comentario">Tu Comentario *</label>
        <textarea
          id="comentario"
          className="input-textarea"
          placeholder="Comparte tu experiencia con este producto..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        ></textarea>

        {/* Mensaje de validación */}
        {mensaje && (
          <p style={{ color: tipoMensaje === 'error' ? 'red' : 'green', marginTop: '10px' }}>{mensaje}</p>
        )}

        <button className="btn-publicar-reseña" onClick={manejarPublicarReseña}>
          Publicar Reseña
        </button>
      </div>
    </div>
  );
};

export default VistaProducto;

/*
✔ Cambios realizados:
- Añadido estado y validaciones para la calificación y comentario.
- Muestra mensajes de error o éxito.
- El formulario se limpia al enviar.
- No se permite enviar reseñas vacías o sin calificación.
*/
