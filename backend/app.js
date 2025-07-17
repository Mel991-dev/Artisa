// backend/app.js
const express = require('express'); //importa el modulo express.js
const cors = require('cors'); //permitir que react se comunique con el backend sin errores
const dotenv = require('dotenv');
 //establece comunicación entre las variables de entorno y el servidor para la conexión
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Cargar variables desde el archivo .env
dotenv.config({ path: './config/variablesEntorno.env' });

const app = express();

// Middleware para permitir solicitudes desde el frontend
app.use(cors());
app.use(express.json());
// Importar y usar rutas
const mainRoutes = require('./routes/main.routes');
app.use('/api', mainRoutes);

// Importar y montar las rutas de artesano
const artesanoRoutes = require('./routes/artesano.routes');
app.use('/api/artesanos', artesanoRoutes); // Monta las rutas bajo /api/artesanos

app.use(logger);
app.use('./',mainRoutes);
app.use(errorHandler);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Artisa corriendo correctamente ✅');
});



// Levantar servidor en el puerto definido
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend escuchando en http://localhost:${PORT}`);
});
