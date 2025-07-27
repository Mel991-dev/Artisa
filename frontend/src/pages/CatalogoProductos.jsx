// frontend/src/components/CatalogoProductos.jsx

import React, { useState } from 'react';
import './catalogo.css';
import './catalogoResponsive.css';
import { Link } from 'react-router-dom';

// Lista de productos simulada
const productos = [
  { id: 1, nombre: 'Collar de Plata Artesanal', categoria: 'Joyería', precio: 45000, artesano: 'María González' },
  { id: 2, nombre: 'Vasija de Barro Tradicional', categoria: 'Cerámica', precio: 32000, artesano: 'Carlos Mendoza' },
  { id: 3, nombre: 'Ruana de Lana Pura', categoria: 'Textiles', precio: 85000, artesano: 'Ana Rodríguez' },
  { id: 4, nombre: 'Bolso de Cuero Grabado', categoria: 'Cuero', precio: 60000, artesano: 'Lucía Martínez' },
  { id: 5, nombre: 'Escultura en Madera Tallada', categoria: 'Madera', precio: 98000, artesano: 'Pedro Rojas' },
  { id: 6, nombre: 'Lámpara de Vidrio Soplado', categoria: 'Vidrio', precio: 72000, artesano: 'Juliana Vega' },
  { id: 7, nombre: 'Billetera de Papel Reciclado', categoria: 'Papel', precio: 18000, artesano: 'Samuel Torres' },
  { id: 8, nombre: 'Pulsera de Piedra Natural', categoria: 'Piedra', precio: 25000, artesano: 'Andrea Gómez' },
  { id: 9, nombre: 'Llavero Artesanal', categoria: 'Otros', precio: 12000, artesano: 'Juan Pérez' },
];

const CatalogoProductos = () => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [rangosSeleccionados, setRangosSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // ⬅️ NUEVO estado

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

  // ✅ Función que aplica los filtros incluyendo búsqueda
  const filtrarProductos = () => {
    return productos.filter(producto => {
      const cumpleCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(producto.categoria);

      const cumpleRango = (() => {
        if (rangosSeleccionados.length === 0) return true;
        for (let rango of rangosSeleccionados) {
          if (rango === '<30' && producto.precio < 30000) return true;
          if (rango === '30-50' && producto.precio >= 30000 && producto.precio <= 50000) return true;
          if (rango === '50-80' && producto.precio > 50000 && producto.precio <= 80000) return true;
          if (rango === '>80' && producto.precio > 80000) return true;
        }
        return false;
      })();

      const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()); // ✅ Búsqueda por nombre

      return cumpleCategoria && cumpleRango && coincideBusqueda;
    });
  };

  const productosFiltrados = filtrarProductos();

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
        <h1 className="catalogo-header">Catálogo de Productos ({productosFiltrados.length} productos)</h1>

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
          {productosFiltrados.map(producto => (
            <div key={producto.id} className="catalogo-producto-card">
              <div className="catalogo-producto-imagen" />
              <div className="catalogo-producto-info">
                <span className="catalogo-producto-categoria">{producto.categoria}</span>
                <h3 className="catalogo-producto-nombre">{producto.nombre}</h3>
                <p className="catalogo-producto-artesano">Por: {producto.artesano}</p>
                <p className="catalogo-producto-precio">${producto.precio.toLocaleString()}</p>
                <Link to="/vista-producto"><button className="btn-vermas">Ver Más</button></Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CatalogoProductos;
