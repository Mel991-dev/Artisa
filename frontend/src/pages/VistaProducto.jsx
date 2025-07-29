// Componente VistaProducto.jsx actualizado con funcionalidad de validación de resenas

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './VistaProducto.css';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importa axios para peticiones HTTP

const VistaProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [artesano, setArtesano] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estados para reseña nueva
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Petición al backend para obtener todos los datos del producto y artesano
        const response = await axios.get(`http://localhost:3000/api/productos/detalle/${id}`);
        setProducto(response.data.producto);
        setArtesano(response.data.artesano);
        // Obtener reseñas desde el nuevo endpoint
        const resenasResp = await axios.get(`http://localhost:3000/api/resenas/producto/${id}`);
        setResenas(resenasResp.data || []);
      } catch (err) {
        setError('Error al cargar los datos del producto');
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const manejarClickEstrella = (valor) => {
    setCalificacion(valor);
  };

  // Función para publicar la reseña usando axios
  const manejarPublicarReseña = async () => {
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
    try {
      const response = await axios.post(
        'http://localhost:3000/api/resenas',
        {
          id_producto: id,
          comentario,
          calificacion
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setMensaje('¡Gracias por tu reseña!');
      setTipoMensaje('exito');
      // Refresca las reseñas desde el backend tras publicar
      try {
        const resenasResp = await axios.get(`http://localhost:3000/api/resenas/producto/${id}`);
        setResenas(resenasResp.data || []);
      } catch {}
      setComentario('');
      setCalificacion(0);
      setHover(0);
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al publicar la reseña.');
      setTipoMensaje('error');
    }
  };

  if (loading) return <div className="contenedor-detalle-producto"><p>Cargando producto...</p></div>;
  if (error) return <div className="contenedor-detalle-producto"><p>{error}</p></div>;
  if (!producto || !artesano) return <div className="contenedor-detalle-producto"><p>No se encontró el producto.</p></div>;

  return (
    <div className="contenedor-detalle-producto">
      <div className="contenedor-principal-producto">
        <div className="producto-imagen-galeria">
          <div className="imagen-principal">
            <img
              src={producto.imagen ? `http://localhost:3000/uploads/productos/${producto.imagen}` : '/img/product-default.svg'}
              alt={producto.nombre}
            />
          </div>
        </div>

        <div className="producto-detalles">
          <h1 className="producto-titulo">{producto.nombre}</h1>
          {/* Descripción debajo del nombre */}
          {producto.descripcion && (
            <div className="producto-descripcion" style={{ marginBottom: '1rem' }}>
              <h3>Descripción</h3>
              <p>{producto.descripcion}</p>
            </div>
          )}
          <div className="producto-calificacion">
            <span>{'★'.repeat(Math.round(producto.promedio_calificacion || 0)) + '☆'.repeat(5 - Math.round(producto.promedio_calificacion || 0))}</span>
            <span className="total-resenas">({resenas.length} resenas)</span>
          </div>
          <p className="producto-precio">${producto.precio?.toLocaleString()}</p>
          <p className="producto-stock">
            📦 <span>Stock disponible: {producto.stock}</span>
          </p>
          <div className="producto-artesano">
            <p className="etiqueta-creado">Creado por:</p>
            <div className="perfil-artesano">
              <img
                className="avatar"
                src={artesano.foto_perfil ? `http://localhost:3000/uploads/${artesano.foto_perfil}` : '/img/user-default.svg'}
                alt={artesano.nombre}
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginRight: 12 }}
              />
              <div className="info-artesano">
                <p className="nombre-artesano">{artesano.nombre}</p>
                <p>{artesano.biografia}</p>
              </div>
            </div>
            <Link to={`/artesano/${artesano.id_artesano}`}>
              <button className="btn-perfil-artesano">Ver Perfil del Artesano</button>
            </Link>
          </div>
          <button className="btn-agregar-carrito">🛒 Añadir al Carrito</button>
        </div>
      </div>

      <div className="resenas-publicadas">
        <h2 className="titulo-resenas">Resenas de Clientes ({resenas.length})</h2>
        {resenas.length === 0 ? (
          <p>No hay resenas aún para este producto.</p>
        ) : (
          resenas.map((r, idx) => (
            <div className="reseña" key={r.id_reseña || idx} style={{ position: 'relative' }}>
              <div className="reseña-cabecera">
                <strong>{r.nombre_usuario || 'Usuario'}</strong>
                <span className="fecha-reseña">{r.fecha ? new Date(r.fecha).toLocaleString() : ''}</span>
                {/* Icono de 3 puntos */}
                <div className="menu-reseña">
                  <button className="btn-menu-reseña" tabIndex={0}>
                    <img src="/img/dots-vertical.svg" alt="Opciones" style={{ width: 20, height: 20, background: 'none', border: 'none' }} />
                  </button>
                  <div className="opciones-reseña">
                    <button className="opcion-reseña">Actualizar</button>
                    <button className="opcion-reseña">Eliminar</button>
                  </div>
                </div>
              </div>
              <p className="reseña-calificacion">
                {'★'.repeat(r.calificacion) + '☆'.repeat(5 - r.calificacion)}
              </p>
              <p>{r.comentario}</p>
            </div>
          ))
        )}
      </div>

      <div className="formulario-reseña">
        <h2 className="titulo-reseña">Deja tu Reseña</h2>
        <p className="nota-usuarios">Solo los usuarios que han comprado este producto pueden dejar resenas</p>

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

        {mensaje && (
          <p style={{ color: tipoMensaje === 'error' ? 'red' : 'green', marginTop: '10px' }}>{mensaje}</p>
        )}

        <button className="dashboard-artesano-add-btn" onClick={manejarPublicarReseña}>
          Publicar Reseña
        </button>
      </div>

      {/* ...existing code... */}
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
