# 📸 API DE GALERÍA - ARTISA

## 🔗 **ENDPOINTS DISPONIBLES**

### **1. Obtener Galería de un Artesano**
```http
GET /api/galeria/artesano/:id_artesano
```
**Descripción:** Obtiene todas las imágenes de la galería de un artesano específico
**Respuesta:**
```json
[
  {
    "id_galeria": 1,
    "id_artesano": 1,
    "nombre_archivo": "imagen.jpg",
    "ruta_archivo": "/uploads/artesanos/galeria/imagen.jpg",
    "descripcion": "Descripción de la imagen",
    "es_principal": true,
    "fecha_subida": "2025-01-15T10:30:00"
  }
]
```

### **2. Crear Nueva Imagen en Galería**
```http
POST /api/galeria
```
**Headers:** `Authorization: Bearer <token>`
**Body:** `multipart/form-data`
- `imagen`: Archivo de imagen (requerido)
- `descripcion`: Descripción de la imagen (opcional)

**Respuesta:**
```json
{
  "msg": "Imagen agregada correctamente.",
  "id_galeria": 123
}
```

### **3. Actualizar Imagen de Galería** ⭐ **NUEVO**
```http
PUT /api/galeria/:id_galeria
```
**Headers:** `Authorization: Bearer <token>`
**Body:** `multipart/form-data`
- `imagen`: Archivo de imagen (opcional)
- `descripcion`: Nueva descripción (opcional)

**Respuesta:**
```json
{
  "msg": "Foto actualizada correctamente.",
  "foto": {
    "id_galeria": 1,
    "id_artesano": 1,
    "nombre_archivo": "nueva-imagen.jpg",
    "ruta_archivo": "/uploads/artesanos/galeria/nueva-imagen.jpg",
    "descripcion": "Nueva descripción",
    "es_principal": false,
    "fecha_subida": "2025-01-15T10:30:00"
  }
}
```

### **4. Eliminar Imagen de Galería**
```http
DELETE /api/galeria/:id_galeria
```
**Headers:** `Authorization: Bearer <token>`

**Respuesta:**
```json
{
  "msg": "Foto eliminada correctamente."
}
```

### **5. Establecer Imagen como Principal**
```http
POST /api/galeria/:id_galeria/principal
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "id_artesano": 1
}
```

**Respuesta:**
```json
{
  "msg": "Foto establecida como principal correctamente."
}
```

## 🔧 **EJEMPLO DE USO EN FRONTEND**

### **Actualizar Imagen y Descripción:**
```javascript
const actualizarImagen = async (id_galeria, nuevaDescripcion, nuevaImagen) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Agregar descripción
    formData.append('descripcion', nuevaDescripcion);
    
    // Agregar imagen si existe
    if (nuevaImagen) {
      formData.append('imagen', nuevaImagen);
    }
    
    const response = await axios.put(
      `http://localhost:3000/api/galeria/${id_galeria}`, 
      formData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log('Imagen actualizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data);
    throw error;
  }
};
```

## ✅ **VALIDACIONES IMPLEMENTADAS**

### **Seguridad:**
- ✅ Autenticación JWT requerida
- ✅ Verificación de propiedad (solo el artesano puede actualizar sus fotos)
- ✅ Validación de tipos de archivo (solo imágenes)
- ✅ Límite de tamaño (5MB máximo)

### **Funcionalidad:**
- ✅ Actualización de descripción
- ✅ Actualización de imagen
- ✅ Eliminación automática de imagen anterior
- ✅ Respuesta con datos actualizados
- ✅ Manejo de errores detallado

## 🚀 **CÓMO PROBAR LA API**

### **1. Con Postman:**
```
PUT http://localhost:3000/api/galeria/1
Headers:
  Authorization: Bearer <tu_token>
Body (form-data):
  descripcion: "Nueva descripción"
  imagen: [archivo de imagen]
```

### **2. Con cURL:**
```bash
curl -X PUT \
  -H "Authorization: Bearer <tu_token>" \
  -F "descripcion=Nueva descripción" \
  -F "imagen=@/ruta/a/tu/imagen.jpg" \
  http://localhost:3000/api/galeria/1
```

## 📝 **NOTAS IMPORTANTES**

1. **Solo el propietario** de la imagen puede actualizarla
2. **La imagen anterior se elimina automáticamente** si se sube una nueva
3. **La descripción es opcional** - si no se envía, se mantiene la anterior
4. **La imagen es opcional** - si no se envía, solo se actualiza la descripción
5. **Máximo 5MB** por imagen
6. **Solo formatos de imagen** (jpg, png, gif, etc.)

## 🔍 **LOGS Y DEBUGGING**

La API incluye logs detallados para debugging:
- Datos recibidos
- Validaciones realizadas
- Operaciones de archivo
- Errores específicos

Revisa la consola del servidor para ver los logs en tiempo real. 