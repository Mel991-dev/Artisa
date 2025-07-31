# 📝 API DE BLOG - ARTISA

## 🔗 **ENDPOINTS DISPONIBLES**

### **1. Crear Artículo**
```http
POST /api/blog/articulos
```
**Headers:** `Content-Type: multipart/form-data`
**Body:**
- `id_usuario`: ID del usuario (requerido)
- `titulo`: Título del artículo (requerido)
- `contenido`: Contenido del artículo (requerido)
- `imagen_blog`: Archivo de imagen (opcional)

**Respuesta:**
```json
{
  "msg": "Artículo creado exitosamente."
}
```

### **2. Obtener Todos los Artículos**
```http
GET /api/blog/articulos
```
**Respuesta:**
```json
[
  {
    "id_post": 1,
    "id_usuario": 1,
    "titulo": "Título del artículo",
    "contenido": "Contenido del artículo...",
    "fecha_publicacion": "2025-01-15T10:30:00",
    "imagen_blog": "1753834453496-937097378-adso.jpg",
    "autor": "Juan Pérez"
  }
]
```

### **3. Obtener Artículos por Usuario (Dashboard)**
```http
GET /api/blog/articulos/usuario/:id_usuario
```
**Respuesta:**
```json
[
  {
    "id_post": 1,
    "id_usuario": 1,
    "titulo": "Mi primer artículo",
    "contenido": "Contenido del artículo...",
    "fecha_publicacion": "2025-01-15T10:30:00",
    "imagen_blog": "1753834453496-937097378-adso.jpg",
    "autor": "Juan Pérez"
  }
]
```

### **4. Obtener Artículo por ID**
```http
GET /api/blog/articulos/:id_post
```
**Respuesta:**
```json
{
  "id_post": 1,
  "id_usuario": 1,
  "titulo": "Título del artículo",
  "contenido": "Contenido completo del artículo...",
  "fecha_publicacion": "2025-01-15T10:30:00",
  "imagen_blog": "1753834453496-937097378-adso.jpg",
  "autor": "Juan Pérez"
}
```

### **5. Actualizar Artículo**
```http
PUT /api/blog/articulos/:id_post
```
**Headers:** `Content-Type: multipart/form-data`
**Body:**
- `titulo`: Nuevo título (requerido)
- `contenido`: Nuevo contenido (requerido)
- `imagen_blog`: Nueva imagen (opcional)

**Respuesta:**
```json
{
  "msg": "Artículo actualizado exitosamente."
}
```

### **6. Eliminar Artículo**
```http
DELETE /api/blog/articulos/:id_post
```
**Respuesta:**
```json
{
  "msg": "Artículo eliminado exitosamente."
}
```

## 📁 **ESTRUCTURA DE ARCHIVOS**

### **Imágenes de Blog:**
- **Carpeta:** `backend/uploads/blog/`
- **Formato:** Cualquier formato de imagen soportado
- **Nomenclatura:** `timestamp-random-originalname.ext`

### **Base de Datos:**
- **Tabla:** `BlogPost`
- **Campos principales:**
  - `id_post` (PK)
  - `id_usuario` (FK)
  - `titulo`
  - `contenido`
  - `fecha_publicacion`
  - `imagen_blog`

## 🔧 **CONFIGURACIÓN**

### **Middleware de Upload:**
```javascript
const storage = multer.diskStorage({
  destination: 'uploads/blog',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
```

### **Validaciones:**
- ✅ **Artículo existe** antes de actualizar/eliminar
- ✅ **Campos requeridos** validados
- ✅ **Manejo de errores** completo
- ✅ **Logs de debugging** incluidos

## 🚀 **USO EN FRONTEND**

### **Ejemplo de Creación:**
```javascript
const formData = new FormData();
formData.append('id_usuario', 1);
formData.append('titulo', 'Mi artículo');
formData.append('contenido', 'Contenido del artículo');
formData.append('imagen_blog', file);

const response = await axios.post('http://localhost:3000/api/blog/articulos', formData);
```

### **Ejemplo de Obtención:**
```javascript
const response = await axios.get('http://localhost:3000/api/blog/articulos/usuario/1');
const articulos = response.data;
```

### **Ejemplo de Eliminación:**
```javascript
await axios.delete(`http://localhost:3000/api/blog/articulos/${id_post}`);
``` 