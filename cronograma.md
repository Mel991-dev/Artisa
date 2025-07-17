
---

# Mapeo de Historias de Usuario (HU) a Epics y Tareas

| Historia de Usuario | Epic/Tarea Principal |
|---------------------|---------------------|
| HU-1, HU-2          | GFA-3: Autenticación y Usuarios |
| HU-3                | GFA-4: Perfiles de Artesano |
| HU-4, HU-5          | GFA-5: Catálogo y Productos |
| HU-6                | GFA-6: Carrito y Compras |
| HU-7, HU-8          | GFA-7: Pagos y Envíos |
| HU-9                | GFA-8: Reseñas y Calificaciones |
| HU-10               | GFA-9: Blog y Contenido |
| HU-11               | GFA-10: Administración |

---

## Epics y Tareas Principales

## EPIC GFA-1: ANÁLISIS Y PLANIFICACIÓN
**Código:** GFA-1  
**Duración:** 6-9 julio 2025 (4 días)
**Horas estimadas:** 24 horas  

### Tareas Principales:

#### 1.1 Análisis de Requerimientos
- **1.1.1** Definición detallada de casos de uso
- **1.1.2** Identificación de entidades y relaciones
- **1.1.3** Definición de roles de usuario (Artesano, Comprador, Administrador)
- **1.1.4** Análisis de flujos de negocio
- **1.1.5** Definición de APIs necesarias
- **1.1.6** Formulación de historias de usuario y criterios de aceptación
- **1.1.7** Mapeo de historias de usuario a epics y tareas

#### 1.2 Diseño de Arquitectura
- **1.2.1** Diagramas de procesos
- **1.2.2** Diagrama uml del software
- **1.2.3** Diseño de arquitectura del sistema
- **1.2.4** Definición de estructura de carpetas
- **1.2.5** Planificación de base de datos
- **1.2.6** Diseño de seguridad y autenticación

#### 1.3 Diseño de Base de Datos
- **1.3.1** Modelado entidad-relación
- **1.3.2** Creación de scripts SQL
- **1.3.3** Definición de índices y constraints
- **1.3.4** Planificación de backup y recuperación
- **1.3.5** Ajuste de modelo ERD y scripts según historias de usuario

#### 1.4 Diseño de los Mockups
- **1.4.1** Actualización de mockups según historias de usuario
- **1.4.2** Creación de mockups de interfaz
- **1.4.3** Definición de componentes UI
- **1.4.4** Diseño responsive

---

## EPIC GFA-2: CONFIGURACIÓN Y INFRAESTRUCTURA
**Código:** GFA-2  
**Duración:** 10-11 julio 2025 (2 días)  
**Horas estimadas:** 12 horas  

### Tareas Principales:

#### 2.1 Configuración del Entorno
- **2.1.1** Configuración de repositorio Git
- **2.1.2** Setup de entorno de desarrollo
- **2.1.3** Configuración de Node.js y dependencias
- **2.1.4** Configuración de SQL Server

#### 2.2 Estructura Base del Proyecto
- **2.2.1** Creación de estructura backend
- **2.2.2** Configuración de Express.js
- **2.2.3** Setup de React con Vite
- **2.2.4** Configuración de rutas base
- **2.2.5** Setup de middleware básico
- **2.2.6** Estructura de carpetas y archivos alineada a historias de usuario

---

## EPIC GFA-3: SISTEMA DE AUTENTICACIÓN Y USUARIOS
**Código:** GFA-3  
**Duración:** 12-13 julio 2025 (2 días)  
**Horas estimadas:** 12 horas  

### Tareas Principales:

#### 3.1 Backend - Autenticación
- **3.1.1** Implementación de registro de usuarios para compradores y artesanos
- **3.1.2** Sistema de login con JWT
- **3.1.3** Middleware de autenticación
- **3.1.4** Gestión de roles y permisos
- **3.1.5** Validaciones de seguridad
- **3.1.6** Endpoint de cierre de sesión (logout)

#### 3.2 Frontend - Interfaces de Autenticación
- **3.2.1** Formulario de registro para compradores y artesanos
- **3.2.2** Formulario de login
- **3.2.3** Gestión de estado de autenticación
- **3.2.4** Protección de rutas
- **3.2.5** Testing de autenticación
- **3.2.6** Componente de cierre de sesión

---

## EPIC GFA-4: GESTIÓN DE PERFILES DE ARTESANOS
**Código:** GFA-4  
**Duración:** 14 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### Tareas Principales:

#### 4.1 Backend - CRUD Artesanos
- **4.1.1** API para crear perfil de artesano
- **4.1.2** API para actualizar información
- **4.1.3** API para subir fotos de taller y galería de fotos
- **4.1.4** Gestión de biografía e historia
- **4.1.5** Validaciones de datos
- **4.1.6** Endpoint para obtener perfil público de artesano

#### 4.2 Frontend - Gestión de Perfiles
- **4.2.1** Formulario de perfil de artesano
- **4.2.2** Dashboard de artesano
- **4.2.3** Gestión de fotos y galería para múltiples fotos
- **4.2.4** Testing de funcionalidades
- **4.2.5** Validaciones frontend
- **4.2.6** Vista pública del perfil de artesano

---

## EPIC GFA-5: CATÁLOGO DE PRODUCTOS
**Código:** GFA-5  
**Duración:** 15 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### Tareas Principales:

#### 5.1 Backend - CRUD Productos
- **5.1.1** API para crear productos
- **5.1.2** API para listar productos con filtros por artesano, nombre, precio, etc.
- **5.1.3** API para actualizar productos
- **5.1.4** API para eliminar productos
- **5.1.5** Gestión de galería de imágenes de productos
- **5.1.6** Categorización de productos
- **5.1.7** Endpoint para filtrar productos por artesano, nombre, precio, etc.

#### 5.2 Frontend - Catálogo Público
- **5.2.1** Página principal con productos
- **5.2.2** Filtros por categoría
- **5.2.3** Vista detallada de producto con galería de imágenes y perfil de artesano
- **5.2.4** Búsqueda de productos
- **5.2.5** Testing de catálogo
- **5.2.6** Vista de productos por artesano
- **5.2.7** Mostrar perfil público del artesano en la vista de producto

---

## EPIC GFA-6: SISTEMA DE RESEÑAS Y CALIFICACIONES
**Código:** GFA-6  
**Duración:** 16 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### Tareas Principales:

#### 6.1 Backend - Sistema de Reseñas
- **6.1.1** API para crear reseñas (solo compradores pueden dejar reseñas)
- **6.1.2** API para listar reseñas por producto
- **6.1.3** Cálculo de calificaciones promedio
- **6.1.4** Validaciones de reseñas
- **6.1.5** Sistema anti-spam
- **6.1.6** Validar que solo compradores puedan dejar reseñas

#### 6.2 Frontend - Interfaz de Reseñas
- **6.2.1** Formulario de reseña
- **6.2.2** Visualización de reseñas
- **6.2.3** Sistema de estrellas
- **6.2.4** Testing de reseñas
- **6.2.5** Validaciones frontend
- **6.2.6** Mostrar solo reseñas de compradores verificados

---

## EPIC GFA-7: SISTEMA DE PAGOS Y ENVÍOS
**Código:** GFA-7  
**Duración:** 17 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### Tareas Principales:

#### 7.1 Backend - Integración de Pagos
- **7.1.1** Integración con PayPal
- **7.1.2** Integración con tarjetas de crédito
- **7.1.3** Gestión de transacciones
- **7.1.4** Cálculo de costos de envío
- **7.1.5** Seguridad de pagos
- **7.1.6** Endpoint para actualizar estado de envío por artesano

#### 7.2 Frontend - Proceso de Compra
- **7.2.1** Carrito de compras
- **7.2.2** Checkout seguro
- **7.2.3** Confirmación de pago
- **7.2.4** Tracking de envíos
- **7.2.5** Testing de pagos
- **7.2.6** Vista de estado de pedido para comprador y artesano

---

## EPIC GFA-8: BLOG Y CONTENIDO
**Código:** GFA-8  
**Duración:** 18 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### Tareas Principales:

#### 8.1 Backend - Sistema de Blog
- **8.1.1** API para crear artículos
- **8.1.2** API para listar artículos
- **8.1.3** Gestión de categorías
- **8.1.4** Sistema de comentarios
- **8.1.5** SEO básico
- **8.1.6** Moderación de artículos por administrador

#### 8.2 Frontend - Blog Público
- **8.2.1** Lista de artículos
- **8.2.2** Vista detallada de artículo
- **8.2.3** Sistema de comentarios
- **8.2.4** Búsqueda de contenido
- **8.2.5** Testing de blog
- **8.2.6** Vista de artículos destacados o recomendados

---

## EPIC GFA-9: DASHBOARD ADMINISTRATIVO
**Código:** GFA-9  
**Duración:** 19 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### Tareas Principales:

#### 9.1 Backend - APIs Administrativas
- **9.1.1** Dashboard de estadísticas
- **9.1.2** Gestión de usuarios
- **9.1.3** Moderación de contenido
- **9.1.4** Reportes de ventas
- **9.1.5** Configuraciones del sistema
- **9.1.6** Moderación de reseñas y blog

#### 9.2 Frontend - Panel Administrativo
- **9.2.1** Dashboard principal
- **9.2.2** Gestión de usuarios
- **9.2.3** Moderación de productos
- **9.2.4** Reportes y estadísticas
- **9.2.5** Testing administrativo
- **9.2.6** Gestión de permisos y roles desde el panel admin

---

## EPIC GFA-10: TESTING Y OPTIMIZACIÓN
**Código:** GFA-10  
**Duración:** 20 julio 2025 (1 día)  
**Horas estimadas:** 8 horas  

### Tareas Principales:

#### 10.1 Testing Integral
- **10.1.1** Testing unitario backend
- **10.1.2** Testing de integración
- **10.1.3** Testing de frontend
- **10.1.4** Testing de seguridad
- **10.1.5** Testing de rendimiento
- **10.1.6** Pruebas de aceptación basadas en criterios de historias de usuario

#### 10.2 Optimización y Corrección
- **10.2.1** Optimización de consultas SQL
- **10.2.2** Optimización de imágenes
- **10.2.3** Corrección de bugs críticos
- **10.2.4** Mejoras de UX/UI
- **10.2.5** Optimización de carga

---

## EPIC GFA-11: DOCUMENTACIÓN Y PREPARACIÓN
**Código:** GFA-11  
**Duración:** 6-21 Julio 2025 (Desarrollar durante todo el proyecto)  
**Horas estimadas:** 150 Horas aprox.  

### Tareas Principales:

#### 11.1 Documentación Técnica
- **11.1.1** Manual técnico completo
- **11.1.2** Documentación de APIs
- **11.1.3** Guía de instalación
- **11.1.4** Documentación de base de datos
- **11.1.5** Guía de despliegue
- **11.1.6** Documentación de historias de usuario y criterios de aceptación

#### 11.2 Documentación de Usuario
- **11.2.1** Manual de usuario artesanos
- **11.2.2** Manual de usuario compradores
- **11.2.3** Manual de administrador
- **11.2.4** Videos tutoriales
- **11.2.5** FAQ y soporte

---

## Consideraciones Especiales

- Todas las funcionalidades y pruebas están alineadas a las historias de usuario y sus criterios de aceptación.
- Los mockups y la experiencia de usuario reflejan los flujos definidos en las historias de usuario.
- El cronograma y las incidencias en Jira se mantienen sincronizados con estos lineamientos.

---

