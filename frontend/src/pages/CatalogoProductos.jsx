/*
-------------------------------------------------------------
DOCUMENTACIÓN: LÓGICA DE MANEJO DE IMÁGENES EN CATÁLOGO DE PRODUCTOS
-------------------------------------------------------------

1. Problema detectado:
- El campo 'imagen' en la base de datos puede contener la ruta completa o solo el nombre de archivo.
- El frontend construía la URL concatenando la ruta base y el campo 'imagen', lo que podía duplicar la ruta y causar errores 404.
- No había lógica de fallback, así que si la imagen fallaba, se mostraba el ícono roto.

2. Solución aplicada:
- Se creó la función extraerNombreArchivo(ruta) para obtener solo el nombre de archivo, sin importar si el campo contiene la ruta completa o parcial.
- Al construir la URL de la imagen, se usa:
    src={`/uploads/productos/${extraerNombreArchivo(producto.imagen)}`}
- Se agregó lógica de fallback para mostrar 'product-default.svg' si la imagen falla.

3. Recomendaciones para futuros desarrollos:
- Guardar en la base de datos solo el nombre de archivo, nunca la ruta completa.
- El backend debe servir la carpeta de archivos estáticos con Express usando una ruta clara (/uploads).
- El frontend debe construir la URL concatenando la ruta base y el nombre de archivo, usando la función extraerNombreArchivo si es necesario.
- Usar una imagen por defecto si la imagen real no existe o falla la carga.

4. Beneficios:
- Evita errores de duplicación de rutas y 404.
- Hace el código más mantenible y predecible.
- Permite cambiar la estructura de carpetas sin modificar la base de datos.
- Facilita el manejo de imágenes y otros archivos estáticos en todo el proyecto.
-------------------------------------------------------------
*/

// frontend/src/components/CatalogoProductos.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa axios para peticiones HTTP
import './catalogo.css';
import './catalogoResponsive.css';
import { Link } from 'react-router-dom';

// Función para extraer solo el nombre de archivo de la imagen
function extraerNombreArchivo(ruta) {
  if (!ruta) return '';
  const partes = ruta.split('/');
  return partes[partes.length - 1];
}

// Componente para manejar la imagen de producto con control de fallback
function ImagenProducto({ src, alt }) {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? '/img/product-default.svg' : src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}

const CatalogoProductos = () => {
  // Hooks deben ir dentro de la función del componente
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [rangosSeleccionados, setRangosSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Cargar productos desde el backend al montar el componente y cuando cambian los filtros
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construir query params para filtros
        let params = {};
        if (busqueda) params.nombre = busqueda;
        if (categoriasSeleccionadas.length > 0) params.categoria = categoriasSeleccionadas[0]; // Solo uno por simplicidad
        if (rangosSeleccionados.length > 0) {
          if (rangosSeleccionados.includes('<30')) params.precioMax = 30000;
          if (rangosSeleccionados.includes('30-50')) { params.precioMin = 30000; params.precioMax = 50000; }
          if (rangosSeleccionados.includes('50-80')) { params.precioMin = 50001; params.precioMax = 80000; }
          if (rangosSeleccionados.includes('>80')) params.precioMin = 80001;
        }
        const response = await axios.get('http://localhost:3000/api/productos', { params });
        setProductos(response.data);
      } catch (err) {
        setError('Error al cargar productos');
      }
      setLoading(false);
    };
    fetchProductos();
  }, [busqueda, categoriasSeleccionadas, rangosSeleccionados]);

  const manejarCambioCategoria = (categoria) => {
    setCategoriasSeleccionadas(prev =>
      prev.includes(categoria)
        ? prev.filter(cat => cat !== categoria)
        : [...prev, categoria]
    );
  };

  const manejarCambioRango = (rango) => {
    setRangosSeleccionados(prev =>
      prev.includes(rango)
        ? prev.filter(r => r !== rango)
        : [...prev, rango]
    );
  };



  return (
    <div className="catalogo-container">

      <button className="btn-filtrar-toggle" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
        {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>

            {/* ✅ Barra lateral de filtros con clase visible si el estado está activado */}
      <aside className={`catalogo-sidebar ${mostrarFiltros ? 'visible' : ''}`}>
        <h2 className="catalogo-sidebar-title">Filtros</h2>

        <div className="catalogo-filtro-bloque">
          <h3>Categoría</h3>
          {['Joyería', 'Cerámica', 'Textiles', 'Madera', 'Cuero', 'Metal', 'Vidrio', 'Papel', 'Piedra', 'Otros'].map((cat, idx) => (
            <label key={idx} className="catalogo-filtro-opcion">
              <input
                type="checkbox"
                onChange={() => manejarCambioCategoria(cat)}
                checked={categoriasSeleccionadas.includes(cat)}
              /> {cat}
            </label>
          ))}
        </div>

        <div className="catalogo-filtro-bloque">
          <h3>Rango de Precio</h3>
          <label className="catalogo-filtro-opcion">
            <input type="checkbox" onChange={() => manejarCambioRango('<30')} checked={rangosSeleccionados.includes('<30')} /> Menos de $30.000
          </label>
          <label className="catalogo-filtro-opcion">
            <input type="checkbox" onChange={() => manejarCambioRango('30-50')} checked={rangosSeleccionados.includes('30-50')} /> $30.000 - $50.000
          </label>
          <label className="catalogo-filtro-opcion">
            <input type="checkbox" onChange={() => manejarCambioRango('50-80')} checked={rangosSeleccionados.includes('50-80')} /> $50.000 - $80.000
          </label>
          <label className="catalogo-filtro-opcion">
            <input type="checkbox" onChange={() => manejarCambioRango('>80')} checked={rangosSeleccionados.includes('>80')} /> Más de $80.000
          </label>
        </div>
      </aside>

      <main className="catalogo-main">
        <h1 className="catalogo-header">Catálogo de Productos ({productos.length} productos)</h1>

        {/* ✅ Input de Búsqueda */}
        <div className="barra-busqueda">
          <input
            type="text"
            placeholder="🔍 Buscar productos por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="catalogo-productos-grid">
          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p>{error}</p>
          ) : productos.length === 0 ? (
            <p>No hay productos disponibles.</p>
          ) : (
            productos.map(producto => (
              <div key={producto.id_producto} className="catalogo-producto-card">
                <div className="catalogo-producto-imagen">
                  {producto.imagen ? (
                    <ImagenProducto
                    src={`http://localhost:3000/uploads/productos/${extraerNombreArchivo(producto.imagen)}`}
                    alt={producto.nombre}
                    />
                  ) : (
                    <img
                      src="/img/product-default.svg"
                      alt="Imagen por defecto"
                    />
                  )}
                </div>
                <div className="catalogo-producto-info">
                  <span className="catalogo-producto-categoria">{producto.nombre_categoria}</span>
                  <h3 className="catalogo-producto-nombre">{producto.nombre}</h3>
                  <p className="catalogo-producto-artesano">Por: {producto.nombre_artesano || 'Sin artesano'}</p>
                  <p className="catalogo-producto-precio">${producto.precio?.toLocaleString()}</p>
                  <Link to={`/vista-producto/${producto.id_producto}`}>
                    <button className="btn-vermas">Ver Más</button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CatalogoProductos;
