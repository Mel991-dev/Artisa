// frontend/src/App.jsx

import React, { useState } from 'react';
// Importa los componentes de Login y Register
import Login from './pages/Login';
import Register from './pages/Register';

/**
 * Componente principal de la aplicación.
 * Muestra los formularios de login y registro si el usuario no está autenticado.
 * Si el usuario está autenticado, muestra un mensaje de bienvenida.
 */
function App() {
  // Estado para manejar la autenticación del usuario
  const [auth, setAuth] = useState(() => {
    // Busca el token en localStorage para mantener la sesión
    const token = localStorage.getItem('token');
    return token ? { token } : null;
  });

  return (
    <div>
      {/* Si el usuario NO está autenticado, muestra los formularios */}
      {!auth ? (
        <>
          <Login setAuth={setAuth} />
          <Register />
        </>
      ) : (
        // Si el usuario está autenticado, muestra un mensaje de bienvenida
        <div>Bienvenido, usuario autenticado</div>
      )}
    </div>
  );
}

export default App;
