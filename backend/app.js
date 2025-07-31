// backend/app.js
const express = require('express'); //importa el modulo express.js
const cors = require('cors'); //permitir que react se comunique con el backend sin errores
const dotenv = require('dotenv');
 //establece comunicación entre las variables de entorno y el servidor para la conexión
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

// Cargar variables desde el archivo .env
dotenv.config({ path: './config/variablesEntorno.env' });

const app = express();

app.use(cors());
app.use(express.json());

// Configurar carpeta pública para servir imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar y usar rutas principales (si tienes otras rutas agrupadas)
const mainRoutes = require('./routes/main.routes');
app.use('/api', mainRoutes);

// Importar y montar las rutas de autenticación (SOLO UNA VEZ)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Importar y montar las rutas de productos
const productoRoutes = require('./routes/producto.routes');
app.use('/api/productos', productoRoutes);

// Importar y montar las rutas de artesano
const artesanoRoutes = require('./routes/artesano.routes');
app.use('/api/artesanos', artesanoRoutes);

// Importar y montar las rutas de galería
const galeriaRoutes = require('./routes/galeria.routes');
app.use('/api/galeria', galeriaRoutes);
const blogRoutes = require('./routes/blog.routes');
app.use('/api/blog', blogRoutes);

// Importar y montar las rutas de usuario
const usuarioRoutes = require('./routes/usuario.routes');
app.use('/api/usuarios', usuarioRoutes);

// Importar y montar las rutas de administrador
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

app.use(logger);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend escuchando en http://localhost:${PORT}`);
});

// Importar y montar las rutas de reseñas
const resenaRoutes = require('./routes/resena.routes');
app.use('/api/resenas', require('./routes/resena.routes'));