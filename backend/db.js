const dotenv = require('dotenv');
dotenv.config({ path: './config/variablesEntorno.env' });
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10), // Asegúrate de que DB_PORT esté definido
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Conexión exitosa a SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err);
    throw err;
  });

module.exports = {
  sql, poolPromise
};
