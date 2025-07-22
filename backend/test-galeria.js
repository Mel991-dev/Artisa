// backend/test-galeria.js
const axios = require('axios');

async function testGaleria() {
  try {
    console.log('Probando conexión con el backend...');
    
    // Probar que el servidor esté corriendo
    const response = await axios.get('http://localhost:3000/api/productos');
    console.log('✅ Backend está corriendo');
    
    // Probar ruta de galería
    const galeriaResponse = await axios.get('http://localhost:3000/api/galeria/artesano/1');
    console.log('✅ Ruta de galería funciona:', galeriaResponse.data);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    }
  }
}

testGaleria(); 