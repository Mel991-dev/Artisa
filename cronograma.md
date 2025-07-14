


---

**Cursor**

# Cronograma de Desarrollo - Artisa Marketplace

## Resumen Ejecutivo
**Proyecto:** Artisa - Marketplace de Artesanías Locales  
**Fecha de inicio:** 6 de julio 2025  
**Fecha de entrega:** 21 de julio 2025  
**Duración total:** 16 días (incluyendo 1 día de presentación)  
**Tecnologías:** React, Node.js Express, SQL Server  
**Metodología:** Agile con desarrollo full-stack integrado

---

## EPIC GFA-1: ANÁLISIS Y PLANIFICACIÓN
**Código:** GFA-1  
**Duración:** 6-9 julio 2025 (4 días)
**Horas estimadas:** 24 horas  

### �� Tareas Principales:

#### 1.1 Análisis de Requerimientos (8-10 horas)
- **1.1.1** Definición detallada de casos de uso
- **1.1.2** Identificación de entidades y relaciones
- **1.1.3** Definición de roles de usuario (Artesano, Comprador, Administrador)
- **1.1.4** Análisis de flujos de negocio
- **1.1.5** Definición de APIs necesarias

#### 1.2 Diseño de Arquitectura (6-8 horas)
- **1.2.1** Diagramas de procesos
- **1.2.2** Diagrama uml del software
- **1.2.3** Diseño de arquitectura del sistema
- **1.2.4** Definición de estructura de carpetas
- **1.2.5** Planificación de base de datos
- **1.2.6** Diseño de seguridad y autenticación

#### 1.3 Diseño de Base de Datos (6-8 horas)
- **1.3.1** Modelado entidad-relación
- **1.3.2** Creación de scripts SQL
- **1.3.3** Definición de índices y constraints
- **1.3.4** Planificación de backup y recuperación

#### 1.4 Wireframes y Mockups (4-6 horas)
- **1.4.2** Creación de mockups de interfaz
- **1.4.3** Definición de componentes UI
- **1.4.4** Diseño responsive

---

## EPIC GFA-2: CONFIGURACIÓN Y INFRAESTRUCTURA
**Código:** GFA-2  
**Duración:** 10-11 julio 2025 (2 días)  
**Horas estimadas:** 12 horas  

### �� Tareas Principales:

#### 2.1 Configuración del Entorno (4-5 horas)
- **2.1.1** Configuración de repositorio Git
- **2.1.2** Setup de entorno de desarrollo
- **2.1.3** Configuración de Node.js y dependencias
- **2.1.4** Configuración de SQL Server

#### 2.2 Estructura Base del Proyecto (4-5 horas)
- **2.2.1** Creación de estructura backend
- **2.2.2** Configuración de Express.js
- **2.2.3** Setup de React con Vite
- **2.2.4** Configuración de rutas base
- **2.2.5** Setup de middleware básico

---

## EPIC GFA-3: SISTEMA DE AUTENTICACIÓN Y USUARIOS
**Código:** GFA-3  
**Duración:** 12-13 julio 2025 (1 días)  
**Horas estimadas:** 12 horas  

### �� Tareas Principales:

#### 3.1 Backend - Autenticación (6-8 horas)
- **3.1.1** Implementación de registro de usuarios
- **3.1.2** Sistema de login con JWT
- **3.1.3** Middleware de autenticación
- **3.1.4** Gestión de roles y permisos
- **3.1.5** Validaciones de seguridad

#### 3.2 Frontend - Interfaces de Autenticación (4-6 horas)
- **3.2.1** Formulario de registro
- **3.2.2** Formulario de login
- **3.2.3** Gestión de estado de autenticación
- **3.2.4** Protección de rutas
- **3.2.5** Testing de autenticación

---

## EPIC GFA-4: GESTIÓN DE PERFILES DE ARTESANOS
**Código:** GFA-4  
**Duración:** 14 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### �� Tareas Principales:

#### 4.1 Backend - CRUD Artesanos (6-8 horas)
- **4.1.1** API para crear perfil de artesano
- **4.1.2** API para actualizar información
- **4.1.3** API para subir fotos de taller
- **4.1.4** Gestión de biografía e historia
- **4.1.5** Validaciones de datos

#### 4.2 Frontend - Gestión de Perfiles (4-6 horas)
- **4.2.1** Formulario de perfil de artesano
- **4.2.2** Dashboard de artesano
- **4.2.3** Gestión de fotos y galería
- **4.2.4** Testing de funcionalidades
- **4.2.5** Validaciones frontend

---

## EPIC GFA-5: CATÁLOGO DE PRODUCTOS
**Código:** GFA-5  
**Duración:** 15 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### �� Tareas Principales:

#### 5.1 Backend - CRUD Productos (8-10 horas)
- **5.1.1** API para crear productos
- **5.1.2** API para listar productos con filtros
- **5.1.3** API para actualizar productos
- **5.1.4** API para eliminar productos
- **5.1.5** Gestión de imágenes de productos
- **5.1.6** Categorización de productos

#### 5.2 Frontend - Catálogo Público (4-6 horas)
- **5.2.1** Página principal con productos
- **5.2.2** Filtros por categoría
- **5.2.3** Vista detallada de producto
- **5.2.4** Búsqueda de productos
- **5.2.5** Testing de catálogo

---

## EPIC GFA-6: SISTEMA DE RESEÑAS Y CALIFICACIONES
**Código:** GFA-6  
**Duración:** 16 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### �� Tareas Principales:

#### 6.1 Backend - Sistema de Reseñas (4-6 horas)
- **6.1.1** API para crear reseñas
- **6.1.2** API para listar reseñas por producto
- **6.1.3** Cálculo de calificaciones promedio
- **6.1.4** Validaciones de reseñas
- **6.1.5** Sistema anti-spam

#### 6.2 Frontend - Interfaz de Reseñas (4-6 horas)
- **6.2.1** Formulario de reseña
- **6.2.2** Visualización de reseñas
- **6.2.3** Sistema de estrellas
- **6.2.4** Testing de reseñas
- **6.2.5** Validaciones frontend

---

## EPIC GFA-7: SISTEMA DE PAGOS Y ENVÍOS
**Código:** GFA-7  
**Duración:** 17 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### �� Tareas Principales:

#### 7.1 Backend - Integración de Pagos (6-8 horas)
- **7.1.1** Integración con PayPal
- **7.1.2** Integración con tarjetas de crédito
- **7.1.3** Gestión de transacciones
- **7.1.4** Cálculo de costos de envío
- **7.1.5** Seguridad de pagos

#### 7.2 Frontend - Proceso de Compra (4-6 horas)
- **7.2.1** Carrito de compras
- **7.2.2** Checkout seguro
- **7.2.3** Confirmación de pago
- **7.2.4** Tracking de envíos
- **7.2.5** Testing de pagos

---

## EPIC GFA-8: BLOG Y CONTENIDO
**Código:** GFA-8  
**Duración:** 18 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### �� Tareas Principales:

#### 8.1 Backend - Sistema de Blog (4-6 horas)
- **8.1.1** API para crear artículos
- **8.1.2** API para listar artículos
- **8.1.3** Gestión de categorías
- **8.1.4** Sistema de comentarios
- **8.1.5** SEO básico

#### 8.2 Frontend - Blog Público (4-6 horas)
- **8.2.1** Lista de artículos
- **8.2.2** Vista detallada de artículo
- **8.2.3** Sistema de comentarios
- **8.2.4** Búsqueda de contenido
- **8.2.5** Testing de blog

---

## EPIC GFA-9: DASHBOARD ADMINISTRATIVO
**Código:** GFA-9  
**Duración:** 19 julio 2025 (1 día)  
**Horas estimadas:** 4-6 horas  

### �� Tareas Principales:

#### 9.1 Backend - APIs Administrativas (6-8 horas)
- **9.1.1** Dashboard de estadísticas
- **9.1.2** Gestión de usuarios
- **9.1.3** Moderación de contenido
- **9.1.4** Reportes de ventas
- **9.1.5** Configuraciones del sistema

#### 9.2 Frontend - Panel Administrativo (4-6 horas)
- **9.2.1** Dashboard principal
- **9.2.2** Gestión de usuarios
- **9.2.3** Moderación de productos
- **9.2.4** Reportes y estadísticas
- **9.2.5** Testing administrativo

---

## EPIC GFA-10: TESTING Y OPTIMIZACIÓN
**Código:** GFA-10  
**Duración:** 20 julio 2025 (1 día)  
**Horas estimadas:** 8 horas  

### �� Tareas Principales:

#### 10.1 Testing Integral (8-10 horas)
- **10.1.1** Testing unitario backend
- **10.1.2** Testing de integración
- **10.1.3** Testing de frontend
- **10.1.4** Testing de seguridad
- **10.1.5** Testing de rendimiento

#### 10.2 Optimización y Corrección (8-10 horas)
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

### �� Tareas Principales:

#### 11.1 Documentación Técnica (6-8 horas)
- **11.1.1** Manual técnico completo
- **11.1.2** Documentación de APIs
- **11.1.3** Guía de instalación
- **11.1.4** Documentación de base de datos
- **11.1.5** Guía de despliegue

#### 11.2 Documentación de Usuario (6-8 horas)
- **11.2.1** Manual de usuario artesanos
- **11.2.2** Manual de usuario compradores
- **11.2.3** Manual de administrador
- **11.2.4** Videos tutoriales
- **11.2.5** FAQ y soporte

---

## RESUMEN DE CRONOGRAMA

| EPIC | Código | Días | Horas | Fechas |
|------|--------|------|-------|--------|
| Análisis y Planificación | GFA-1 | 4 | 24 | 6-9 julio |
| Configuración | GFA-2 | 2 | 12 | 10-11 julio |
| Autenticación | GFA-3 | 2 | 12 |  12-13 julio |
| Perfiles Artesanos | GFA-4 | 1 | 4-6 | 14 julio |
| Catálogo Productos | GFA-5 | 1 | 4-6 | 15 julio |
| Reseñas | GFA-6 | 1 | 4-6 | 16 julio |
| Pagos | GFA-7 | 1 | 4-6 | 17 julio |
| Blog | GFA-8 | 1 | 4-6 | 18 julio |
| Dashboard Admin | GFA-9 | 1 | 4-6 | 19 julio |
| Testing | GFA-10 | 2 | 8 | 20 julio |
| Documentación | GFA-11 | 16 | 104~ | 6-21 julio |

**Total:** 16 días, 104 horas

---

## CONSIDERACIONES ESPECIALES

### Dependencias Críticas:
- GFA-1 debe completarse antes de GFA-2
- GFA-3 (Autenticación) es prerrequisito para GFA-4, GFA-5, GFA-6
- GFA-5 (Productos) es prerrequisito para GFA-6 (Reseñas)
- GFA-7 (Pagos) requiere GFA-5 completado

### Riesgos Identificados:
- Integración de pagos puede requerir más tiempo
- Testing de seguridad puede revelar vulnerabilidades
- Optimización de imágenes puede ser compleja

### Mitigaciones:
- Desarrollo paralelo de frontend y backend
- Testing continuo durante desarrollo
- Uso de librerías probadas para pagos
- Optimización progresiva de imágenes

Este cronograma asegura la entrega de un marketplace completamente funcional el 21 de julio de 2025, con todas las funcionalidades core implementadas y probadas.

