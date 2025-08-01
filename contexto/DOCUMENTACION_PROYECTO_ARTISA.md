# Documentación Técnica y Lógica del Proyecto Artisa

## Índice
1. [Introducción](#introducción)
2. [Arquitectura General](#arquitectura-general)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Frontend (React)](#frontend-react)
    - [Estructura de Componentes y Páginas](#estructura-de-componentes-y-páginas)
    - [Manejo de Estado y Contexto](#manejo-de-estado-y-contexto)
    - [Ruteo y Protección de Rutas](#ruteo-y-protección-de-rutas)
    - [Validaciones en el Frontend](#validaciones-en-el-frontend)
    - [Consumo de APIs y Manejo de Errores](#consumo-de-apis-y-manejo-de-errores)
    - [Estilos y UX/UI](#estilos-y-uxui)
5. [Backend (Node.js/Express)](#backend-nodejsexpress)
    - [Estructura de Carpetas y Archivos](#estructura-de-carpetas-y-archivos)
    - [Modelos y Controladores](#modelos-y-controladores)
    - [Rutas y Endpoints](#rutas-y-endpoints)
    - [Middleware y Seguridad](#middleware-y-seguridad)
    - [Validaciones en el Backend](#validaciones-en-el-backend)
    - [Manejo de Archivos y Subidas](#manejo-de-archivos-y-subidas)
6. [Base de Datos (SQL Server)](#base-de-datos-sql-server)
    - [Modelo Entidad-Relación](#modelo-entidad-relación)
    - [Estructura de Tablas y Relaciones](#estructura-de-tablas-y-relaciones)
    - [Consultas y Procedimientos](#consultas-y-procedimientos)
7. [Flujos de Datos y Casos de Uso](#flujos-de-datos-y-casos-de-uso)
8. [Validaciones y Seguridad Integral](#validaciones-y-seguridad-integral)
9. [Recomendaciones para Nuevos Desarrolladores](#recomendaciones-para-nuevos-desarrolladores)
10. [Anexos](#anexos)

---

## Introducción
Artisa es una plataforma web de comercio electrónico y comunidad, orientada a la promoción y venta de productos artesanales. El sistema permite la gestión de usuarios (compradores, artesanos y administradores), productos, galerías de imágenes, artículos de blog y reseñas, integrando funcionalidades de autenticación, autorización y manejo seguro de datos.

Esta documentación está diseñada para proporcionar una visión completa y detallada de la lógica, estructura y validaciones implementadas, facilitando la incorporación de nuevos desarrolladores y la evolución del proyecto.

---

## Arquitectura General
- **Monolito desacoplado:** Frontend (React) y Backend (Node.js/Express) en carpetas separadas.
- **MVC:** El backend sigue el patrón Modelo-Vista-Controlador.
- **RESTful APIs:** Comunicación entre frontend y backend mediante endpoints REST.
- **Base de datos relacional:** SQL Server, con modelo entidad-relación bien definido.
- **Autenticación y autorización:** JWT, middlewares de roles y protección de rutas.

---

## Estructura de Carpetas

```
artisa/
  backend/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    uploads/
    app.js
    db.js
    ...
  frontend/
    public/
    src/
      components/
      context/
      pages/
      ...
  ...
```

### Backend
- **controllers/**: Lógica de negocio y manejo de peticiones.
- **middleware/**: Funciones intermedias (auth, roles, logger, manejo de errores, uploads).
- **models/**: Acceso y manipulación de datos en la base de datos.
- **routes/**: Definición de endpoints y vinculación con controladores.
- **uploads/**: Almacenamiento de imágenes subidas.

### Frontend
- **components/**: Componentes reutilizables (Header, Footer, PrivateRoute, etc).
- **context/**: Contextos globales (ej. AuthContext para autenticación).
- **pages/**: Vistas principales (Login, Register, Dashboard, etc).
- **public/**: Archivos estáticos (imágenes, index.html).

---

## Frontend (React)

### Estructura de Componentes y Páginas
- **Componentes:**
  - `Header.jsx`: Navegación principal, menú dinámico según rol.
  - `Footer.jsx`: Pie de página institucional.
  - `PrivateRoute.jsx`: Protección de rutas privadas.
- **Páginas:**
  - `Login.jsx`, `Register.jsx`: Formularios de autenticación y registro.
  - `DashboardArtesano.jsx`, `DashboardAdmin.jsx`: Paneles de gestión según rol.
  - `EditarUsuario.jsx`, `EditarArtesano.jsx`: Formularios de edición de perfil.
  - `GestionarGaleria.jsx`, `CatalogoProductos.jsx`, `Carrito.jsx`, etc.

#### Organización recomendada para `src/`:
```
src/
  components/
    Header/
      Header.jsx
      Header.css
    Footer/
      Footer.jsx
      Footer.css
    ...
  pages/
    Auth/
      Login.jsx
      Login.css
      Register.jsx
      Register.css
    Dashboard/
      DashboardArtesano.jsx
      DashboardArtesano.css
      DashboardAdmin.jsx
      DashboardAdmin.css
      EditarUsuario.jsx
      EditarUsuario.css
      EditarArtesano.jsx
      EditarArtesano.css
    Blog/
      CrearArticulo.jsx
      EditarArticulo.jsx
      ...
    Productos/
      CatalogoProductos.jsx
      ...
    ...
  context/
    AuthContext.jsx
  App.jsx
  index.js
  ...
```

### Manejo de Estado y Contexto
- **useState/useEffect:** Para estados locales y efectos secundarios.
- **AuthContext:** Contexto global para autenticación, usuario y token.
- **LocalStorage:** Persistencia de sesión y datos del usuario.

### Ruteo y Protección de Rutas
- **React Router:** Definición de rutas públicas y privadas.
- **PrivateRoute/AdminRoute:** Componentes que verifican autenticación y rol antes de renderizar.
- **Redirección:** Según el rol tras login (`navigate('/dashboard-admin')`, etc).

### Validaciones en el Frontend
- **Formularios:**
  - Validación de campos obligatorios (nombre, correo, contraseña, etc).
  - Validación de formato de correo y longitud de contraseña.
  - Validación de coincidencia de contraseñas (registro).
  - Validación dinámica de campos según rol (campos de artesano sólo si el rol es artesano).
- **Feedback visual:**
  - Mensajes de error y éxito.
  - Deshabilitación de botones durante envío.
- **Ejemplo de validación en Register.jsx:**
  - Si el usuario selecciona "Artesano", aparecen los campos de especialidad, biografía e historia.
  - Si cambia a "Comprador", estos campos se ocultan y no se envían.

### Consumo de APIs y Manejo de Errores
- **Axios:**
  - Interceptores para añadir token JWT a las peticiones.
  - Manejo de errores global y por componente.
- **FormData:**
  - Para subir imágenes y datos mixtos.
- **Manejo de respuestas:**
  - Redirección tras éxito.
  - Mensajes de error claros en caso de fallo.

### Estilos y UX/UI
- **CSS modularizado:**
  - Archivos `.css` por componente/página.
- **Paleta institucional:**
  - Colores tierra, tipografía profesional (Inter).
- **Responsive:**
  - Flexbox, grid, media queries.
- **Accesibilidad:**
  - Etiquetas semánticas, roles ARIA en menús.

---

## Backend (Node.js/Express)

### Estructura de Carpetas y Archivos
- **app.js:** Configuración principal, middlewares globales, rutas base.
- **db.js:** Conexión a SQL Server.
- **controllers/**: Lógica de negocio (usuarios, productos, blog, galería, etc).
- **models/**: Consultas y operaciones SQL.
- **routes/**: Definición de endpoints y vinculación con controladores.
- **middleware/**: Autenticación, autorización, manejo de errores, uploads.

### Modelos y Controladores
- **usuario.model.js:**
  - Métodos para CRUD de usuarios, actualización de perfil, cambio de rol, obtención de datos de artesano.
- **artesano.model.js, producto.model.js, blogpost.model.js, galeria.model.js, resena.model.js:**
  - Métodos específicos para cada entidad.
- **Controladores:**
  - Reciben la petición, validan datos, llaman a los modelos y devuelven la respuesta.

### Rutas y Endpoints
- **/api/auth/**: Login, registro, verificación de token.
- **/api/usuarios/**: Perfil, edición, obtención de datos de artesano.
- **/api/productos/**: CRUD de productos.
- **/api/blog/**: CRUD de artículos de blog.
- **/api/admin/**: Gestión de usuarios y artesanos (sólo admin).
- **/api/galeria/**: Gestión de imágenes de galería.

### Middleware y Seguridad
- **auth.js:** Verifica JWT y usuario autenticado.
- **roles.js:** Verifica rol de usuario (artesano, admin).
- **admin.js:** Middleware específico para rutas de administrador.
- **errorHandler.js:** Manejo centralizado de errores.
- **upload.js/upload-perfil.js:** Configuración de multer para subida de imágenes.

### Validaciones en el Backend
- **Validación de datos recibidos:**
  - Comprobación de campos obligatorios.
  - Validación de tipos y formatos (ej. correo, contraseña).
  - Validación de existencia de usuario/producto antes de actualizar/eliminar.
- **Validación de roles:**
  - Solo administradores pueden acceder a rutas protegidas.
  - Solo artesanos pueden crear productos o editar su galería.
- **Validación de archivos:**
  - Solo imágenes permitidas, tamaño máximo.

### Manejo de Archivos y Subidas
- **Multer:**
  - Configuración para guardar imágenes de perfil, productos y galería en carpetas específicas.
  - Nombres únicos para evitar colisiones.
- **Rutas estáticas:**
  - Servir imágenes desde `/uploads`.

---

## Base de Datos (SQL Server)

### Modelo Entidad-Relación
- **Entidades principales:** Usuario, Artesano, Administrador, Producto, Pedido, Reseña, BlogPost, Galeria, Perfil, Categoría, MétodoPago, Envío.
- **Relaciones:**
  - Un usuario puede ser artesano o comprador.
  - Un artesano tiene muchos productos.
  - Un producto tiene muchas reseñas.
  - Un usuario tiene un perfil.
  - Un pedido puede tener varios productos y un método de pago.

### Estructura de Tablas y Relaciones
- **Claves primarias y foráneas bien definidas.**
- **Índices en campos de búsqueda (nombre, categoría, ubicación).**
- **Restricciones de integridad referencial.**

### Consultas y Procedimientos
- **CRUD completo** para cada entidad.
- **Consultas JOIN** para obtener datos compuestos (ej. perfil de artesano con productos y galería).
- **Procedimientos para actualización de roles y datos relacionados.**

---

## Flujos de Datos y Casos de Uso

### Ejemplo: Registro de Usuario
1. Usuario completa el formulario en el frontend.
2. Validación de campos en frontend (campos obligatorios, formato de correo, etc).
3. Envío de datos al backend vía API (`/api/auth/register`).
4. Backend valida datos, cifra contraseña, crea usuario y perfil en la base de datos.
5. Respuesta de éxito o error al frontend.

### Ejemplo: Cambio de Rol (Comprador a Artesano)
1. Admin edita usuario desde el dashboard.
2. Si el rol cambia a artesano, se crea registro en la tabla Artesano y se actualizan campos específicos.
3. Si el rol cambia a comprador, se eliminan datos de artesano asociados.
4. Cambios reflejados en la base de datos y en el frontend tras guardar.

### Ejemplo: Subida de Imagen de Perfil
1. Usuario selecciona imagen en el formulario.
2. Se envía como `FormData` al backend.
3. Multer guarda la imagen en `/uploads` y actualiza la ruta en la base de datos.
4. El frontend muestra la nueva imagen tras actualizar.

---

## Validaciones y Seguridad Integral
- **Frontend:**
  - Validación de formularios antes de enviar.
  - Feedback visual inmediato.
- **Backend:**
  - Validación de datos recibidos.
  - Sanitización de entradas para evitar inyección SQL.
  - Cifrado de contraseñas con bcrypt.
  - JWT para autenticación y autorización.
  - Middlewares para protección de rutas y roles.
- **Base de datos:**
  - Restricciones de integridad.
  - Índices para optimizar búsquedas.
  - Backups periódicos y scripts de recuperación.

---

## Recomendaciones para Nuevos Desarrolladores
- **Lee esta documentación antes de modificar el código.**
- **Sigue la estructura de carpetas y convenciones de nombres.**
- **Utiliza los componentes y hooks existentes para mantener la coherencia.**
- **Valida siempre los datos tanto en frontend como en backend.**
- **Prueba los endpoints con herramientas como Postman antes de integrar en frontend.**
- **Mantén los estilos y la experiencia de usuario profesional y consistente.**
- **Documenta cualquier cambio importante en el código o en la base de datos.**

---

## Anexos
- [Manual Técnico](./MANUAL_TECNICO_ARTISA.docx)
- [Manual de Usuario](./MANUAL_USUARIO_ARTISA.docx)
- [Cronograma de Actividades](./cronograma.md)
- [Modelo Entidad-Relación y Scripts SQL](./backend/scripts/galeria-artesano.sql)

---

**Esta documentación está sujeta a actualizaciones conforme evolucione el proyecto.**