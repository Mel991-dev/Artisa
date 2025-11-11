# Artisa - Plataforma de Comercio para Artesanos

## 📋 Descripción General del Proyecto

**Artisa** es una plataforma web fullstack diseñada para conectar artesanos colombianos con compradores interesados en productos hechos a mano. El proyecto busca democratizar el acceso al comercio electrónico para artesanos, permitiéndoles crear perfiles, exhibir sus productos, gestionar ventas y construir una presencia digital profesional.

### 🎯 Objetivos del Proyecto

- **Para Artesanos**: Crear un espacio digital donde puedan mostrar su trabajo, gestionar inventario, procesar pedidos y construir su marca personal.
- **Para Compradores**: Descubrir productos artesanales únicos, conocer la historia detrás de cada artesano y realizar compras seguras.
- **Para Administradores**: Moderar contenido, gestionar usuarios y supervisar la plataforma.

### 🏗️ Arquitectura del Sistema

El proyecto está dividido en dos partes principales:

1. **Backend (API REST)**: Construido con Node.js y Express.js, maneja la lógica de negocio, autenticación, y comunicación con la base de datos SQL Server.
2. **Frontend (SPA)**: Desarrollado con React 19 y Vite, proporciona una interfaz de usuario moderna y reactiva.

### 📅 Contexto de Desarrollo

Este proyecto está siendo desarrollado como parte de un trabajo académico con las siguientes características:

- **Duración**: 6-21 de julio de 2025 (según cronograma)
- **Metodología**: Desarrollo ágil dividido en 11 Epics principales
- **Base de Datos**: SQL Server con conexión a través de MSSQL
- **Autenticación**: Sistema basado en JWT (JSON Web Tokens)
- **Estado Actual**: Infraestructura base configurada, listo para implementar funcionalidades

---

## 🔧 Backend - API REST con Express.js

### 📖 Descripción del Backend

El backend de Artisa funciona como una API RESTful que maneja todas las operaciones del servidor. Está construido sobre Node.js utilizando Express.js como framework principal, proporcionando endpoints para autenticación, gestión de productos, perfiles de artesanos, sistema de pagos y más.

### 🛠️ Tecnologías y Dependencias

#### **Dependencias de Producción**

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| **express** | 5.1.0 | Framework web principal para crear el servidor HTTP y manejar rutas, middleware y peticiones/respuestas |
| **cors** | 2.8.5 | Middleware para habilitar CORS (Cross-Origin Resource Sharing), permite que el frontend React se comunique con el backend sin errores de origen cruzado |
| **dotenv** | 17.2.0 | Carga variables de entorno desde archivos `.env` para mantener credenciales y configuraciones sensibles fuera del código |
| **mssql** | 11.0.1 | Driver oficial de Node.js para conectarse a bases de datos SQL Server. Maneja consultas, transacciones y conexiones a la base de datos Artisa |
| **react** | 19.1.0 | *Nota: Esta dependencia está listada incorrectamente en el backend y debe removerse* |

### 📦 Instalación del Backend

#### **Prerrequisitos**

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: Versión 18.0.0 o superior (recomendado: 20.x LTS)
  - Verifica tu versión: `node --version`
  - Descarga desde: https://nodejs.org/
- **npm**: Versión 8.0.0 o superior (viene incluido con Node.js)
  - Verifica tu versión: `npm --version`
- **SQL Server**: SQL Server Express 2019 o superior
  - Debe estar instalado y ejecutándose en `localhost\SQLEXPRESS`

#### **Paso 1: Clonar o Descargar el Proyecto**

```bash
# Si usas Git
git clone [URL_DEL_REPOSITORIO]
cd artisa

# O descarga el ZIP y extráelo
```

#### **Paso 2: Navegar a la Carpeta del Backend**

```bash
cd backend
```

#### **Paso 3: Instalar Dependencias**

```bash
npm install
```

Este comando instalará todas las dependencias listadas en `package.json`:

- `express@5.1.0` - Framework web
- `cors@2.8.5` - Manejo de CORS
- `dotenv@17.2.0` - Variables de entorno
- `mssql@11.0.1` - Conector SQL Server

**Nota**: Si encuentras errores durante la instalación, intenta:
```bash
npm install --legacy-peer-deps
```

#### **Paso 4: Configurar Variables de Entorno**

El archivo de configuración ya está creado en `backend/config/variablesEntorno.env` con las siguientes variables:

```env
DB_SERVER=localhost\SQLEXPRESS
DB_USER=artisaAdmin
DB_PASSWORD=admin1234
DB_NAME=artisa
```

**⚠️ IMPORTANTE**: 
- Modifica estos valores según tu configuración de SQL Server
- Asegúrate de que el usuario `artisaAdmin` tenga permisos sobre la base de datos `artisa`
- En producción, usa credenciales más seguras

#### **Paso 5: Configurar la Base de Datos**

1. Abre SQL Server Management Studio (SSMS)
2. Conéctate a tu instancia `localhost\SQLEXPRESS`
3. Crea la base de datos:

```sql
CREATE DATABASE artisa;
GO

USE artisa;
GO

-- Crea el usuario (si no existe)
CREATE LOGIN artisaAdmin WITH PASSWORD = 'admin1234';
CREATE USER artisaAdmin FOR LOGIN artisaAdmin;
EXEC sp_addrolemember 'db_owner', 'artisaAdmin';
```

**Nota**: Los scripts SQL completos para crear las tablas se agregarán durante el Epic GFA-1 (Análisis y Planificación).

#### **Paso 6: Iniciar el Servidor Backend**

```bash
node app.js
```

Deberías ver el mensaje:
```
✅ Servidor backend escuchando en http://localhost:3000
```

#### **Paso 7: Verificar que el Backend Funciona**

Abre tu navegador o usa una herramienta como Postman:

```
GET http://localhost:3000/
```

Deberías recibir:
```
Servidor Artisa corriendo correctamente ✅
```

Y para la ruta de la API:
```
GET http://localhost:3000/api/
```

Respuesta esperada:
```json
{
  "mensaje": "Hola desde el backend de Artisa 🧶"
}
```

### 📁 Estructura del Backend

```
backend/
├── app.js                          # Punto de entrada principal
├── config/
│   └── variablesEntorno.env       # Variables de entorno
├── middleware/
│   ├── logger.js                  # Middleware para logging de peticiones
│   └── errorHandler.js            # Middleware para manejo de errores
└── routes/
    └── main.routes.js             # Rutas principales de la API
```

### 🔍 Componentes Clave del Backend

#### **app.js** - Servidor Principal

- Inicializa Express
- Configura CORS para permitir peticiones del frontend
- Carga variables de entorno desde el archivo `.env`
- Registra middleware (logger, errorHandler)
- Define rutas base
- Levanta el servidor en el puerto 3000 (o el definido en `.env`)

#### **middleware/logger.js** - Registro de Peticiones

- Registra cada petición HTTP con timestamp, método y URL
- Útil para debugging y monitoreo

#### **middleware/errorHandler.js** - Manejo de Errores

- Captura errores no manejados
- Envía respuestas de error estandarizadas al cliente
- Registra el stack trace en consola

#### **routes/main.routes.js** - Rutas de la API

- Define los endpoints disponibles
- Actualmente solo tiene una ruta de prueba en `/api/`
- Aquí se agregarán todas las rutas de las funcionalidades (autenticación, productos, etc.)

### 🚀 Próximos Pasos del Backend

Según el cronograma del proyecto, las siguientes funcionalidades serán implementadas:

1. **GFA-3**: Sistema de autenticación con JWT
2. **GFA-4**: CRUD de perfiles de artesanos
3. **GFA-5**: CRUD de productos con galería de imágenes
4. **GFA-6**: Sistema de reseñas y calificaciones
5. **GFA-7**: Integración de pagos (PayPal, tarjetas)
6. **GFA-8**: Sistema de blog y contenido
7. **GFA-9**: Dashboard administrativo

---

## ⚛️ Frontend - Aplicación React con Vite

### 📖 Descripción del Frontend

El frontend de Artisa es una Single Page Application (SPA) construida con React 19, la última versión del framework. Utiliza Vite como build tool y development server, proporcionando una experiencia de desarrollo extremadamente rápida con Hot Module Replacement (HMR).

### 🛠️ Tecnologías y Dependencias

#### **Dependencias de Producción**

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| **react** | 19.1.0 | Biblioteca principal de JavaScript para construir interfaces de usuario mediante componentes |
| **react-dom** | 19.1.0 | Proporciona métodos específicos del DOM para renderizar componentes React en el navegador |
| **axios** | 1.10.0 | Cliente HTTP basado en promesas para hacer peticiones al backend. Simplifica las llamadas a la API REST |

#### **Dependencias de Desarrollo**

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| **vite** | 7.0.4 | Build tool y dev server ultra-rápido. Reemplaza a Webpack con mejor rendimiento |
| **@vitejs/plugin-react** | 4.6.0 | Plugin oficial de Vite para soportar React con Fast Refresh |
| **eslint** | 9.30.1 | Linter para identificar y reportar patrones problemáticos en código JavaScript/React |
| **@eslint/js** | 9.30.1 | Configuración base de ESLint para JavaScript |
| **eslint-plugin-react-hooks** | 5.2.0 | Reglas de ESLint para verificar el uso correcto de React Hooks |
| **eslint-plugin-react-refresh** | 0.4.20 | Reglas de ESLint para asegurar compatibilidad con Fast Refresh |
| **@types/react** | 19.1.8 | Definiciones de tipos TypeScript para React (mejora el intellisense) |
| **@types/react-dom** | 19.1.6 | Definiciones de tipos TypeScript para React DOM |
| **globals** | 16.3.0 | Lista de variables globales de JavaScript para ESLint |

### 📦 Instalación del Frontend

#### **Prerrequisitos**

- **Node.js**: Versión 20.19.0 o 22.12.0 o superior (requerido por Vite 7)
  - Verifica tu versión: `node --version`
  - Si tienes una versión anterior, actualiza Node.js
- **npm**: Versión 8.0.0 o superior

#### **Paso 1: Navegar a la Carpeta del Frontend**

```bash
# Desde la raíz del proyecto
cd frontend
```

#### **Paso 2: Instalar Dependencias**

```bash
npm install
```

Este comando instalará:

**Dependencias de Producción:**
- `react@19.1.0`
- `react-dom@19.1.0`
- `axios@1.10.0`

**Dependencias de Desarrollo:**
- `vite@7.0.4`
- `@vitejs/plugin-react@4.6.0`
- `eslint@9.30.1` y plugins relacionados
- Tipos de TypeScript para React

El proceso puede tardar 1-2 minutos dependiendo de tu conexión a internet.

#### **Paso 3: Configurar Axios para Conectar con el Backend**

Actualmente, el archivo `frontend/src/services/api.js` está vacío. Necesitas agregar la configuración de Axios:

```javascript
// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default API;
```

**Explicación:**
- `baseURL`: Define la URL base del backend (puerto 3000)
- `headers`: Configura el tipo de contenido como JSON
- Esta instancia de Axios se importa en los componentes que necesitan hacer peticiones

#### **Paso 4: Iniciar el Servidor de Desarrollo**

```bash
npm run dev
```

Verás un output similar a:

```
  VITE v7.0.4  ready in 350 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Nota**: El puerto puede variar (5173, 5174, etc.) si el puerto está ocupado.

#### **Paso 5: Abrir la Aplicación en el Navegador**

1. Abre tu navegador
2. Navega a `http://localhost:5173`
3. Deberías ver el mensaje: **"Hola desde el backend de Artisa 🧶"**

Este mensaje se obtiene del backend mediante la petición configurada en `App.jsx`.

### 📁 Estructura del Frontend

```
frontend/
├── index.html                 # Punto de entrada HTML
├── package.json              # Dependencias y scripts
├── vite.config.js            # Configuración de Vite
├── eslint.config.js          # Configuración de ESLint
├── public/
│   └── vite.svg             # Assets públicos (favicon, etc.)
├── src/
│   ├── main.jsx             # Punto de entrada de React
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos del App
│   ├── index.css            # Estilos globales
│   ├── services/
│   │   └── api.js           # Configuración de Axios
│   └── assets/
│       └── react.svg        # Assets importados
```

### 🔍 Componentes Clave del Frontend

#### **main.jsx** - Punto de Entrada

- Importa React y ReactDOM
- Renderiza el componente `<App />` dentro del elemento `#root`
- Utiliza `StrictMode` para detectar problemas potenciales

#### **App.jsx** - Componente Principal

- Usa `useEffect` para hacer una petición GET al backend cuando el componente se monta
- Utiliza `useState` para manejar el estado del mensaje recibido
- Muestra el mensaje en un `<h1>`

**Código actual:**

```javascript
import { useEffect, useState } from 'react';
import API from './services/api';

function App() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    API.get('/')
      .then(res => setMensaje(res.data.mensaje))
      .catch(err => setMensaje('Error al conectar con el backend'));
  }, []);

  return (
    <div>
      <h1>{mensaje}</h1>
    </div>
  );
}

export default App;
```

#### **vite.config.js** - Configuración de Vite

- Importa y configura el plugin de React
- Define opciones de build y desarrollo
- Actualmente usa la configuración mínima

#### **services/api.js** - Cliente HTTP

- Configura una instancia de Axios con la baseURL del backend
- Centraliza la configuración de peticiones HTTP
- Facilita el mantenimiento y testing

### 🎨 Scripts Disponibles

El `package.json` del frontend incluye los siguientes scripts:

```json
{
  "scripts": {
    "dev": "vite",              // Inicia servidor de desarrollo
    "build": "vite build",      // Crea build de producción
    "lint": "eslint .",         // Ejecuta el linter
    "preview": "vite preview"   // Previsualiza el build de producción
  }
}
```

**Uso:**

```bash
npm run dev      # Desarrollo (hot reload)
npm run build    # Build para producción (carpeta dist/)
npm run lint     # Verificar código con ESLint
npm run preview  # Ver el build antes de desplegar
```

### 🚀 Próximos Pasos del Frontend

Según el cronograma, implementarás:

1. **GFA-3**: Formularios de registro y login, protección de rutas
2. **GFA-4**: Dashboard de artesanos, formularios de perfil
3. **GFA-5**: Catálogo de productos, filtros y búsqueda
4. **GFA-6**: Sistema de reseñas con estrellas
5. **GFA-7**: Carrito de compras y checkout
6. **GFA-8**: Blog y sistema de comentarios
7. **GFA-9**: Panel administrativo

---

## 🧪 Verificación de la Instalación Completa

Para verificar que todo está funcionando correctamente:

### 1. Backend Corriendo

```bash
# Terminal 1
cd backend
node app.js
```

Verifica: `✅ Servidor backend escuchando en http://localhost:3000`

### 2. Frontend Corriendo

```bash
# Terminal 2 (nueva terminal)
cd frontend
npm run dev
```

Verifica: `➜  Local:   http://localhost:5173/`

### 3. Comunicación Frontend-Backend

Abre `http://localhost:5173` en tu navegador. Deberías ver:

**"Hola desde el backend de Artisa 🧶"**

Si ves este mensaje, ¡la comunicación está funcionando! 🎉

---

## 🐛 Solución de Problemas Comunes

### Backend no inicia

**Error: `Cannot find module 'express'`**
- Solución: `cd backend && npm install`

**Error: `EADDRINUSE :::3000`**
- El puerto 3000 está ocupado
- Solución: Cambia el puerto en `variablesEntorno.env` agregando `PORT=3001`

**Error de conexión a SQL Server**
- Verifica que SQL Server esté corriendo
- Verifica las credenciales en `variablesEntorno.env`
- Asegúrate de que el usuario tenga permisos

### Frontend no inicia

**Error: Node version incompatible**
- Solución: Actualiza Node.js a v20.19.0 o superior

**Error: CORS al hacer peticiones**
- Verifica que el backend esté corriendo
- Verifica que `cors()` esté configurado en `backend/app.js`

**Error: `npm ERR! missing script: dev`**
- Solución: Asegúrate de estar en la carpeta `frontend`

---

## 📚 Recursos Adicionales

### Documentación Oficial

- **Express.js**: https://expressjs.com/
- **React 19**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Axios**: https://axios-http.com/
- **MSSQL Driver**: https://github.com/tediousjs/node-mssql

### Tutoriales Recomendados

- React + Vite: https://vitejs.dev/guide/
- Express REST API: https://expressjs.com/en/starter/basic-routing.html
- SQL Server con Node.js: https://learn.microsoft.com/en-us/sql/connect/node-js/

---

## 👥 Equipo de Desarrollo

Este proyecto está siendo desarrollado como parte de un trabajo académico. Para continuar con el desarrollo:

1. Revisa el archivo `cronograma.md` para ver las tareas pendientes
2. Implementa los Epics en orden (GFA-3 → GFA-11)
3. Crea las tablas de la base de datos según el diseño del Epic GFA-1
4. Sigue las historias de usuario definidas en el cronograma

---

## 📄 Licencia

#### Licencia MIT

---

**¡Bienvenido a Artisa! 🧶✨**

Si tienes preguntas o encuentras problemas, revisa primero la sección de "Solución de Problemas Comunes" o consulta la documentación oficial de las tecnologías utilizadas.
