// frontend/src/App.jsx

import React from "react";
// Importa el sistema de rutas de React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Importa los componentes de cada página
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DashboardArtesano from "./pages/DashboardArtesano";
import DashboardAdmin from "./pages/DashboardAdmin";
import AdminRoute from "./components/AdminRoute";
import CrearProducto from "./pages/CrearProducto";
import EditarProducto from "./pages/EditarProducto";
import GestionarGaleria from "./pages/GestionarGaleria";
import SubirFotos from "./pages/SubirFotos";
import VerGaleria from "./pages/VerGaleria";
import ActualizarPerfil from "./pages/ActualizarPerfil";
import EditarArtesano from "./pages/EditarArtesano";
import PerfilPublico from "./pages/PerfilPublico";
import PrivateRoute from "./components/PrivateRoute";
import CatalogoProductos from "./pages/CatalogoProductos";
import VistaProducto from "./pages/VistaProducto";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import ConfirmacionPago from "./pages/ConfirmacionPago";
import SeguimientoPedido from "./pages/SeguimientoPedido";
import Blog from "./pages/Blog";
import Articulo from "./pages/Articulo";
import CrearArticulo from "./pages/CrearArticulo";
import EditarArticulo from "./pages/EditarArticulo";
import EditarUsuario from "./pages/EditarUsuario";
import Home from "./pages/Home";
import EditarResena from "./pages/EditarResena";
// import { AuthProvider } from "./context/AuthContext";
import './index.css';

function App() {
  return (
    <Router>
      {/* El Header se muestra SIEMPRE, sin importar la ruta */}
      <Header />
      {/* Aquí se definen las rutas de la app */}
      <Routes>
        {/* Cada Route asocia una URL con un componente */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/artesano/:id" element={<PerfilPublico />} />
        <Route path="/dashboard-artesano" element={
          <PrivateRoute>
            <DashboardArtesano/>
          </PrivateRoute>
        }/>
        <Route path="/dashboard-admin" element={
          <AdminRoute>
            <DashboardAdmin/>
          </AdminRoute>
        }/>
        <Route path="/admin/editar-usuario/:id_usuario" element={
          <AdminRoute>
            <EditarUsuario/>
          </AdminRoute>
        }/>
        <Route path="/admin/editar-artesano/:id_usuario" element={
          <AdminRoute>
            <EditarArtesano/>
          </AdminRoute>
        }/>
        <Route path="/crear-producto" element={<CrearProducto/>}/>
        <Route path="/editar-producto/:id_producto" element={<EditarProducto/>}/>
        <Route path="/gestionar-galeria" element={<GestionarGaleria/>}/>
        <Route path="/subir-fotos" element={<SubirFotos/>}/>
        <Route path="/ver-galeria/:id_artesano" element={<VerGaleria/>}/>
        <Route path="/catalogo-productos" element={<CatalogoProductos/>}/>
        <Route path="/vista-producto/:id" element={<VistaProducto/>}/>
        <Route path="/carrito" element={<Carrito/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/confirmacion-pago" element={<ConfirmacionPago/>}/>
        <Route path="/seguimiento-pedido" element={<SeguimientoPedido/>}/>
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/articulo/:id_post" element={<Articulo/>}/>
        <Route path="/crear-articulo" element={<CrearArticulo/>}/>
        <Route path="/editar-articulo/:id_post" element={<EditarArticulo/>}/>
        <Route path="/perfil" element={
          <PrivateRoute>
            <ActualizarPerfil/>
          </PrivateRoute>
        }/>
        <Route path="/editar-resena/:id_resena" element={<EditarResena />} />
        {/* Puedes agregar más rutas según tus páginas */}
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App; 