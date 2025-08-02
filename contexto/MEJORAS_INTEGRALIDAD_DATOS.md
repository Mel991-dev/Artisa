# Mejoras de Integralidad de Datos - Proyecto Artisa

## Propuestas de Mejoras para Mayor Seguridad y Validación

### 1. Identificación Única Nacional

#### Modificación de Base de Datos
```sql
-- Agregar campo de identificación única
ALTER TABLE [dbo].[Usuario] ADD [identificacion] [nvarchar](20) NULL;

-- Crear índice único para la identificación
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [UQ_Usuario_Identificacion] UNIQUE ([identificacion]);

-- Crear índice para búsquedas rápidas
CREATE INDEX [IX_Usuario_Identificacion] ON [dbo].[Usuario] ([identificacion]);
```

#### Validaciones Frontend (Register.jsx y EditarUsuario.jsx)
```javascript
// Validación de formato de identificación (ejemplo para Colombia)
const validarIdentificacion = (identificacion) => {
  // Solo números, entre 8 y 15 dígitos
  const regex = /^\d{8,15}$/;
  if (!regex.test(identificacion)) {
    return 'La identificación debe contener solo números (8-15 dígitos)';
  }
  
  // Validación de dígito de verificación (algoritmo específico del país)
  // Implementar según el país de residencia
  
  return null; // Válido
};
```

### 2. Validaciones de Teléfono

#### Modificación de Base de Datos
```sql
-- Agregar campo de teléfono
ALTER TABLE [dbo].[Usuario] ADD [telefono] [nvarchar](15) NULL;

-- Crear índice para búsquedas
CREATE INDEX [IX_Usuario_Telefono] ON [dbo].[Usuario] ([telefono]);
```

#### Validaciones Frontend
```javascript
const validarTelefono = (telefono) => {
  // Formato internacional: +57 300 123 4567
  const regex = /^\+?[1-9]\d{1,14}$/;
  if (!regex.test(telefono.replace(/\s/g, ''))) {
    return 'Formato de teléfono inválido';
  }
  return null;
};
```

### 3. Validaciones de Fecha de Nacimiento

#### Modificación de Base de Datos
```sql
-- Agregar campo de fecha de nacimiento
ALTER TABLE [dbo].[Usuario] ADD [fecha_nacimiento] [date] NULL;

-- Crear índice para consultas por edad
CREATE INDEX [IX_Usuario_FechaNacimiento] ON [dbo].[Usuario] ([fecha_nacimiento]);
```

#### Validaciones Frontend
```javascript
const validarFechaNacimiento = (fecha) => {
  const fechaNac = new Date(fecha);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNac.getFullYear();
  
  if (edad < 18) {
    return 'Debes ser mayor de 18 años para registrarte';
  }
  
  if (edad > 120) {
    return 'Fecha de nacimiento inválida';
  }
  
  return null;
};
```

### 4. Validaciones de Dirección Mejoradas

#### Modificación de Base de Datos
```sql
-- Agregar campos adicionales de dirección
ALTER TABLE [dbo].[Usuario] ADD [ciudad] [nvarchar](100) NULL;
ALTER TABLE [dbo].[Usuario] ADD [codigo_postal] [nvarchar](10) NULL;
ALTER TABLE [dbo].[Usuario] ADD [departamento] [nvarchar](100) NULL;
```

#### Validaciones Frontend
```javascript
const validarDireccion = (direccion, ciudad, codigoPostal) => {
  if (direccion.length < 10) {
    return 'La dirección debe tener al menos 10 caracteres';
  }
  
  if (ciudad.length < 2) {
    return 'La ciudad es obligatoria';
  }
  
  // Validar código postal según el país
  const regexCodigoPostal = /^\d{5,6}$/; // Ajustar según el país
  if (codigoPostal && !regexCodigoPostal.test(codigoPostal)) {
    return 'Código postal inválido';
  }
  
  return null;
};
```

### 5. Validaciones de Correo Electrónico Mejoradas

#### Validaciones Frontend
```javascript
const validarCorreo = (correo) => {
  // Validación más estricta de correo
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(correo)) {
    return 'Formato de correo electrónico inválido';
  }
  
  // Verificar dominios comunes válidos
  const dominiosValidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
  const dominio = correo.split('@')[1];
  if (!dominiosValidos.includes(dominio)) {
    return 'Por favor usa un proveedor de correo válido';
  }
  
  return null;
};
```

### 6. Validaciones de Contraseña Mejoradas

#### Validaciones Frontend
```javascript
const validarContraseña = (contraseña) => {
  const errores = [];
  
  if (contraseña.length < 8) {
    errores.push('Mínimo 8 caracteres');
  }
  
  if (!/[A-Z]/.test(contraseña)) {
    errores.push('Al menos una mayúscula');
  }
  
  if (!/[a-z]/.test(contraseña)) {
    errores.push('Al menos una minúscula');
  }
  
  if (!/\d/.test(contraseña)) {
    errores.push('Al menos un número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(contraseña)) {
    errores.push('Al menos un carácter especial');
  }
  
  return errores.length > 0 ? errores.join(', ') : null;
};
```

### 7. Validaciones de Nombre y Apellido

#### Validaciones Frontend
```javascript
const validarNombre = (nombre) => {
  // Solo letras, espacios y algunos caracteres especiales
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
  if (!regex.test(nombre)) {
    return 'El nombre solo puede contener letras y espacios (2-50 caracteres)';
  }
  
  // Verificar que no sea solo espacios
  if (nombre.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }
  
  return null;
};
```

### 8. Validaciones Backend Adicionales

#### Middleware de Validación
```javascript
// backend/middleware/validacion.js
const validarDatosUsuario = (req, res, next) => {
  const { nombre, apellido, correo, identificacion, telefono } = req.body;
  const errores = [];
  
  // Validaciones de formato
  if (nombre && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(nombre)) {
    errores.push('Nombre inválido');
  }
  
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    errores.push('Correo electrónico inválido');
  }
  
  if (identificacion && !/^\d{8,15}$/.test(identificacion)) {
    errores.push('Identificación inválida');
  }
  
  if (telefono && !/^\+?[1-9]\d{1,14}$/.test(telefono.replace(/\s/g, ''))) {
    errores.push('Teléfono inválido');
  }
  
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  
  next();
};
```

### 9. Verificación de Unicidad en Backend

#### Modelo de Usuario Mejorado
```javascript
// backend/models/usuario.model.js
async function verificarUnicidad(correo, identificacion) {
  const pool = await poolPromise;
  
  const resultado = await pool.request()
    .input('correo', sql.NVarChar, correo)
    .input('identificacion', sql.NVarChar, identificacion)
    .query(`
      SELECT 
        CASE WHEN EXISTS (SELECT 1 FROM Usuario WHERE correo = @correo) THEN 'correo' ELSE NULL END as correo_existe,
        CASE WHEN EXISTS (SELECT 1 FROM Usuario WHERE identificacion = @identificacion) THEN 'identificacion' ELSE NULL END as identificacion_existe
    `);
  
  const camposDuplicados = [];
  if (resultado.recordset[0].correo_existe) {
    camposDuplicados.push('correo');
  }
  if (resultado.recordset[0].identificacion_existe) {
    camposDuplicados.push('identificacion');
  }
  
  return camposDuplicados;
}
```

### 10. Implementación de Rate Limiting

#### Middleware de Rate Limiting
```javascript
// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const limiterRegistro = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: 'Demasiados intentos de registro. Intenta de nuevo en 15 minutos.'
});

const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.'
});
```

### 11. Logs de Auditoría

#### Tabla de Auditoría
```sql
CREATE TABLE [dbo].[AuditoriaUsuario](
    [id_auditoria] [int] IDENTITY(1,1) NOT NULL,
    [id_usuario] [int] NULL,
    [accion] [nvarchar](50) NOT NULL,
    [datos_anteriores] [nvarchar](max) NULL,
    [datos_nuevos] [nvarchar](max) NULL,
    [fecha_cambio] [datetime] DEFAULT (getdate()),
    [ip_usuario] [nvarchar](45) NULL,
    [user_agent] [nvarchar](500) NULL,
    PRIMARY KEY CLUSTERED ([id_auditoria] ASC)
);
```

### 12. Implementación Gradual

#### Fase 1: Campos Básicos
1. Agregar identificación única
2. Implementar validaciones frontend básicas
3. Agregar verificaciones de unicidad en backend

#### Fase 2: Validaciones Avanzadas
1. Implementar validaciones de formato más estrictas
2. Agregar campos adicionales (teléfono, fecha nacimiento)
3. Implementar rate limiting

#### Fase 3: Seguridad Avanzada
1. Implementar logs de auditoría
2. Agregar validaciones de país específicas
3. Implementar verificación de correo electrónico

### 13. Consideraciones de UX

#### Feedback Visual Mejorado
```javascript
// Mostrar fortaleza de contraseña en tiempo real
const mostrarFortalezaContraseña = (contraseña) => {
  let fortaleza = 0;
  if (contraseña.length >= 8) fortaleza++;
  if (/[A-Z]/.test(contraseña)) fortaleza++;
  if (/[a-z]/.test(contraseña)) fortaleza++;
  if (/\d/.test(contraseña)) fortaleza++;
  if (/[!@#$%^&*]/.test(contraseña)) fortaleza++;
  
  return {
    nivel: fortaleza,
    color: fortaleza < 2 ? 'red' : fortaleza < 4 ? 'orange' : 'green',
    texto: fortaleza < 2 ? 'Débil' : fortaleza < 4 ? 'Media' : 'Fuerte'
  };
};
```

### 14. Scripts de Migración

#### Script para Agregar Nuevos Campos
```sql
-- Script de migración para agregar nuevos campos
BEGIN TRANSACTION;

-- Agregar nuevos campos
ALTER TABLE [dbo].[Usuario] ADD [identificacion] [nvarchar](20) NULL;
ALTER TABLE [dbo].[Usuario] ADD [telefono] [nvarchar](15) NULL;
ALTER TABLE [dbo].[Usuario] ADD [fecha_nacimiento] [date] NULL;
ALTER TABLE [dbo].[Usuario] ADD [ciudad] [nvarchar](100) NULL;
ALTER TABLE [dbo].[Usuario] ADD [codigo_postal] [nvarchar](10) NULL;
ALTER TABLE [dbo].[Usuario] ADD [departamento] [nvarchar](100) NULL;

-- Crear índices y constraints
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [UQ_Usuario_Identificacion] UNIQUE ([identificacion]);
CREATE INDEX [IX_Usuario_Telefono] ON [dbo].[Usuario] ([telefono]);
CREATE INDEX [IX_Usuario_FechaNacimiento] ON [dbo].[Usuario] ([fecha_nacimiento]);

-- Crear tabla de auditoría
CREATE TABLE [dbo].[AuditoriaUsuario](
    [id_auditoria] [int] IDENTITY(1,1) NOT NULL,
    [id_usuario] [int] NULL,
    [accion] [nvarchar](50) NOT NULL,
    [datos_anteriores] [nvarchar](max) NULL,
    [datos_nuevos] [nvarchar](max) NULL,
    [fecha_cambio] [datetime] DEFAULT (getdate()),
    [ip_usuario] [nvarchar](45) NULL,
    [user_agent] [nvarchar](500) NULL,
    PRIMARY KEY CLUSTERED ([id_auditoria] ASC)
);

COMMIT TRANSACTION;
```

---

## Recomendaciones de Implementación

1. **Implementar gradualmente** para no afectar usuarios existentes
2. **Probar exhaustivamente** cada validación antes de desplegar
3. **Documentar cambios** en la base de datos y APIs
4. **Considerar impacto en UX** y proporcionar feedback claro
5. **Mantener compatibilidad** con datos existentes
6. **Implementar rollback** en caso de problemas

---

## Beneficios Esperados

- **Mayor seguridad** contra fraudes y duplicados
- **Mejor calidad de datos** en la base de datos
- **Cumplimiento normativo** según el país de operación
- **Mejor experiencia de usuario** con validaciones claras
- **Facilidad de mantenimiento** con datos más estructurados 