# Análisis de Integración de Identificación Única - Proyecto Artisa

## Análisis del Modelo Actual

### Estructura Actual de la Tabla Usuario
```sql
CREATE TABLE [dbo].[Usuario](
    [id_usuario] [int] IDENTITY(1,1) NOT NULL,
    [nombre] [nvarchar](100) NULL,
    [apellido] [nvarchar](100) NULL,
    [correo] [nvarchar](100) NULL,
    [contraseña] [nvarchar](255) NULL,
    [direccion] [nvarchar](255) NULL,
    [pais] [nvarchar](100) NULL,
    [rol] [nvarchar](50) NULL,
    PRIMARY KEY CLUSTERED ([id_usuario] ASC),
    CONSTRAINT [UQ_Usuario_Correo] UNIQUE NONCLUSTERED ([correo] ASC)
);
```

### Flujo Actual de Registro
1. **Frontend**: Envía datos básicos (nombre, apellido, correo, contraseña, etc.)
2. **Backend**: Verifica unicidad solo por correo electrónico
3. **Base de Datos**: Inserta usuario y crea perfil/artesano si aplica

## Propuesta de Integración de Identificación Única

### 1. Modificación de Base de Datos

#### Script de Migración
```sql
-- Agregar campo de identificación única
ALTER TABLE [dbo].[Usuario] ADD [identificacion] [nvarchar](20) NULL;

-- Crear constraint único para identificación
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [UQ_Usuario_Identificacion] UNIQUE ([identificacion]);

-- Crear índice para búsquedas rápidas
CREATE INDEX [IX_Usuario_Identificacion] ON [dbo].[Usuario] ([identificacion]);

-- Crear índice compuesto para búsquedas por identificación y correo
CREATE INDEX [IX_Usuario_Identificacion_Correo] ON [dbo].[Usuario] ([identificacion], [correo]);
```

#### Nueva Estructura de Tabla
```sql
CREATE TABLE [dbo].[Usuario](
    [id_usuario] [int] IDENTITY(1,1) NOT NULL,
    [nombre] [nvarchar](100) NULL,
    [apellido] [nvarchar](100) NULL,
    [correo] [nvarchar](100) NULL,
    [identificacion] [nvarchar](20) NULL,  -- NUEVO CAMPO
    [contraseña] [nvarchar](255) NULL,
    [direccion] [nvarchar](255) NULL,
    [pais] [nvarchar](100) NULL,
    [rol] [nvarchar](50) NULL,
    PRIMARY KEY CLUSTERED ([id_usuario] ASC),
    CONSTRAINT [UQ_Usuario_Correo] UNIQUE NONCLUSTERED ([correo] ASC),
    CONSTRAINT [UQ_Usuario_Identificacion] UNIQUE NONCLUSTERED ([identificacion] ASC)  -- NUEVA CONSTRAINT
);
```

### 2. Modificaciones en el Modelo (usuario.model.js)

#### Nueva Función de Verificación de Unicidad
```javascript
// backend/models/usuario.model.js

/**
 * Verifica la unicidad de correo e identificación
 * @param {string} correo - Correo electrónico
 * @param {string} identificacion - Número de identificación
 * @param {number} id_usuario_excluir - ID de usuario a excluir (para actualizaciones)
 * @returns {Object} Campos duplicados encontrados
 */
async function verificarUnicidad(correo, identificacion, id_usuario_excluir = null) {
  try {
    console.log('=== VERIFICAR UNICIDAD ===');
    console.log('Correo:', correo);
    console.log('Identificación:', identificacion);
    console.log('Excluir ID:', id_usuario_excluir);
    
    const pool = await poolPromise;
    
    let query = `
      SELECT 
        CASE WHEN EXISTS (
          SELECT 1 FROM Usuario 
          WHERE correo = @correo 
          ${id_usuario_excluir ? 'AND id_usuario != @id_usuario_excluir' : ''}
        ) THEN 'correo' ELSE NULL END as correo_existe,
        CASE WHEN EXISTS (
          SELECT 1 FROM Usuario 
          WHERE identificacion = @identificacion 
          ${id_usuario_excluir ? 'AND id_usuario != @id_usuario_excluir' : ''}
        ) THEN 'identificacion' ELSE NULL END as identificacion_existe
    `;
    
    const request = pool.request()
      .input('correo', sql.NVarChar, correo)
      .input('identificacion', sql.NVarChar, identificacion);
    
    if (id_usuario_excluir) {
      request.input('id_usuario_excluir', sql.Int, id_usuario_excluir);
    }
    
    const resultado = await request.query(query);
    
    const camposDuplicados = [];
    if (resultado.recordset[0].correo_existe) {
      camposDuplicados.push('correo');
    }
    if (resultado.recordset[0].identificacion_existe) {
      camposDuplicados.push('identificacion');
    }
    
    console.log('Campos duplicados encontrados:', camposDuplicados);
    return camposDuplicados;
  } catch (error) {
    console.error('Error en verificarUnicidad:', error);
    throw error;
  }
}

/**
 * Busca usuarios por identificación (para detección de multicuentas)
 * @param {string} identificacion - Número de identificación
 * @returns {Array} Lista de usuarios con esa identificación
 */
async function buscarPorIdentificacion(identificacion) {
  try {
    console.log('=== BUSCAR POR IDENTIFICACIÓN ===');
    console.log('Identificación:', identificacion);
    
    const pool = await poolPromise;
    const resultado = await pool.request()
      .input('identificacion', sql.NVarChar, identificacion)
      .query(`
        SELECT 
          u.id_usuario,
          u.nombre,
          u.apellido,
          u.correo,
          u.rol,
          u.fecha_creacion,
          p.foto as foto_perfil
        FROM Usuario u
        LEFT JOIN Perfil p ON u.id_usuario = p.id_usuario
        WHERE u.identificacion = @identificacion
        ORDER BY u.fecha_creacion DESC
      `);
    
    console.log('Usuarios encontrados con esta identificación:', resultado.recordset.length);
    return resultado.recordset;
  } catch (error) {
    console.error('Error en buscarPorIdentificacion:', error);
    throw error;
  }
}
```

#### Modificación de obtenerPerfilCompleto
```javascript
// Modificar la consulta para incluir identificación
const usuario = await pool.request()
  .input('id_usuario', sql.Int, id_usuario)
  .query(`
    SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.identificacion, u.direccion, u.pais, u.rol, p.foto 
    FROM Usuario u 
    LEFT JOIN Perfil p ON u.id_usuario = p.id_usuario 
    WHERE u.id_usuario = @id_usuario
  `);
```

#### Modificación de actualizarPerfilCompleto
```javascript
// Agregar identificación a los datos de usuario
const datosUsuario = {
  nombre: datos.nombre,
  apellido: datos.apellido,
  correo: datos.correo,
  identificacion: datos.identificacion,  // NUEVO CAMPO
  direccion: datos.direccion,
  pais: datos.pais,
  rol: datos.rol
};

// Verificar unicidad antes de actualizar
const camposDuplicados = await verificarUnicidad(
  datos.correo, 
  datos.identificacion, 
  id_usuario
);

if (camposDuplicados.length > 0) {
  throw new Error(`Los siguientes campos ya están en uso: ${camposDuplicados.join(', ')}`);
}

// Modificar la query de actualización
let query = 'UPDATE Usuario SET nombre = @nombre, apellido = @apellido, correo = @correo, identificacion = @identificacion, direccion = @direccion, pais = @pais, rol = @rol';
const request = pool.request()
  .input('id_usuario', sql.Int, id_usuario)
  .input('nombre', sql.NVarChar, datosUsuario.nombre)
  .input('apellido', sql.NVarChar, datosUsuario.apellido)
  .input('correo', sql.NVarChar, datosUsuario.correo)
  .input('identificacion', sql.NVarChar, datosUsuario.identificacion)  // NUEVO CAMPO
  .input('direccion', sql.NVarChar, datosUsuario.direccion)
  .input('pais', sql.NVarChar, datosUsuario.pais)
  .input('rol', sql.NVarChar, datosUsuario.rol);
```

### 3. Modificaciones en Controladores

#### Modificación de auth.js (Registro)
```javascript
// backend/routes/auth.js

router.post('/register', async (req, res) => {
  const { nombre, apellido, correo, identificacion, direccion, pais, contraseña, rol, especialidad, biografia, historia } = req.body;
  
  try {
    console.log("Datos recibidos en /register:", req.body);

    // Verificar unicidad de correo e identificación
    const camposDuplicados = await verificarUnicidad(correo, identificacion);
    
    if (camposDuplicados.length > 0) {
      const mensajes = {
        'correo': 'El correo ya está registrado.',
        'identificacion': 'La identificación ya está registrada.'
      };
      
      const errores = camposDuplicados.map(campo => mensajes[campo]);
      return res.status(400).json({ 
        msg: 'Datos duplicados encontrados.',
        errores: errores,
        campos_duplicados: camposDuplicados
      });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);
    
    // Insertar usuario con identificación
    const result = await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('apellido', sql.NVarChar, apellido)
      .input('correo', sql.NVarChar, correo)
      .input('identificacion', sql.NVarChar, identificacion)  // NUEVO CAMPO
      .input('direccion', sql.NVarChar, direccion)
      .input('pais', sql.NVarChar, pais)
      .input('contraseña', sql.NVarChar, hashedPassword)
      .input('rol', sql.NVarChar, rol)
      .query(`
        INSERT INTO Usuario (nombre, apellido, correo, identificacion, direccion, pais, contraseña, rol)
        OUTPUT INSERTED.id_usuario
        VALUES (@nombre, @apellido, @correo, @identificacion, @direccion, @pais, @contraseña, @rol)
      `);
    
    const id_usuario = result.recordset[0].id_usuario;

    // Resto del código para artesanos...
    
    res.status(201).json({ msg: 'Usuario registrado correctamente.' });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});
```

#### Modificación de admin.controller.js
```javascript
// backend/controllers/admin.controller.js

// Modificar obtenerTodosUsuarios para incluir identificación
async function obtenerTodosUsuarios(req, res) {
  try {
    console.log('=== OBTENER TODOS LOS USUARIOS ===');
    
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT 
          u.id_usuario,
          u.nombre,
          u.apellido,
          u.correo,
          u.identificacion,  -- NUEVO CAMPO
          u.direccion,
          u.pais,
          u.rol,
          p.foto as foto_perfil
        FROM Usuario u
        LEFT JOIN Perfil p ON u.id_usuario = p.id_usuario
        ORDER BY u.id_usuario DESC
      `);
    
    console.log('Usuarios encontrados:', result.recordset.length);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ msg: 'Error al obtener usuarios', error: error.message });
  }
}

// Nueva función para detectar multicuentas
async function detectarMulticuentas(req, res) {
  try {
    const { identificacion } = req.params;
    console.log('=== DETECTAR MULTICUENTAS ===');
    console.log('Identificación:', identificacion);
    
    const usuarios = await buscarPorIdentificacion(identificacion);
    
    if (usuarios.length <= 1) {
      return res.json({ 
        tiene_multicuentas: false, 
        usuarios: usuarios 
      });
    }
    
    // Analizar patrones de multicuentas
    const analisis = {
      tiene_multicuentas: true,
      total_cuentas: usuarios.length,
      usuarios: usuarios,
      patrones_sospechosos: []
    };
    
    // Detectar patrones sospechosos
    const correos = usuarios.map(u => u.correo);
    const dominios = [...new Set(correos.map(c => c.split('@')[1]))];
    
    if (dominios.length === 1) {
      analisis.patrones_sospechosos.push('Mismo dominio de correo');
    }
    
    if (usuarios.length > 3) {
      analisis.patrones_sospechosos.push('Más de 3 cuentas con misma identificación');
    }
    
    const fechasCreacion = usuarios.map(u => new Date(u.fecha_creacion));
    const tiempoEntreCuentas = fechasCreacion.map((fecha, i) => {
      if (i === 0) return 0;
      return fecha - fechasCreacion[i-1];
    });
    
    const cuentasRapidas = tiempoEntreCuentas.filter(t => t < 24 * 60 * 60 * 1000).length; // Menos de 24 horas
    if (cuentasRapidas > 0) {
      analisis.patrones_sospechosos.push(`${cuentasRapidas} cuentas creadas en menos de 24 horas`);
    }
    
    res.json(analisis);
  } catch (error) {
    console.error('Error al detectar multicuentas:', error);
    res.status(500).json({ msg: 'Error al detectar multicuentas', error: error.message });
  }
}
```

### 4. Nuevas Rutas para Administración

#### Agregar a admin.routes.js
```javascript
// backend/routes/admin.routes.js

// Ruta para detectar multicuentas
router.get('/multicuentas/:identificacion', isAdmin, detectarMulticuentas);

// Ruta para obtener estadísticas de identificación
router.get('/estadisticas-identificacion', isAdmin, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT 
          COUNT(*) as total_usuarios,
          COUNT(identificacion) as usuarios_con_identificacion,
          COUNT(DISTINCT identificacion) as identificaciones_unicas,
          COUNT(*) - COUNT(DISTINCT identificacion) as posibles_duplicados
        FROM Usuario
      `);
    
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ msg: 'Error al obtener estadísticas', error: error.message });
  }
});
```

### 5. Modificaciones en Frontend

#### Modificación de Register.jsx
```javascript
// frontend/src/pages/Auth/Register.jsx

// Agregar estado para identificación
const [form, setForm] = useState({
  nombre: '',
  apellido: '',
  correo: '',
  identificacion: '',  // NUEVO CAMPO
  direccion: '',
  pais: '',
  contraseña: '',
  confirmarContraseña: '',
  rol: ''
});

// Agregar validación de identificación
const validarIdentificacion = (identificacion) => {
  if (!identificacion) {
    return 'La identificación es obligatoria';
  }
  
  // Solo números, entre 8 y 15 dígitos
  const regex = /^\d{8,15}$/;
  if (!regex.test(identificacion)) {
    return 'La identificación debe contener solo números (8-15 dígitos)';
  }
  
  return null;
};

// Modificar handleSubmit para incluir identificación
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validar identificación
  const errorIdentificacion = validarIdentificacion(form.identificacion);
  if (errorIdentificacion) {
    setErrores([errorIdentificacion]);
    return;
  }
  
  // Resto de validaciones...
  
  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      nombre: form.nombre,
      apellido: form.apellido,
      correo: form.correo,
      identificacion: form.identificacion,  // NUEVO CAMPO
      direccion: form.direccion,
      pais: form.pais,
      contraseña: form.contraseña,
      rol: form.rol,
      especialidad: form.rol === 'artesano' ? artesanoFields.especialidad : '',
      biografia: form.rol === 'artesano' ? artesanoFields.biografia : '',
      historia: form.rol === 'artesano' ? artesanoFields.historia : ''
    });
    
    // Manejar respuesta...
  } catch (error) {
    if (error.response?.data?.campos_duplicados) {
      setErrores(error.response.data.errores);
    } else {
      setMsg(error.response?.data?.msg || 'Error al registrar usuario');
    }
  }
};
```

#### Modificación de EditarUsuario.jsx y EditarArtesano.jsx
```javascript
// Agregar campo de identificación en el formulario
<div className="form-group">
  <label htmlFor="identificacion">Identificación *</label>
  <input
    id="identificacion"
    name="identificacion"
    type="text"
    value={form.identificacion}
    onChange={handleChange}
    placeholder="Número de identificación"
    required
  />
</div>
```

### 6. Nuevas Funcionalidades de Administración

#### DashboardAdmin.jsx - Agregar Sección de Detección de Fraudes
```javascript
// frontend/src/pages/DashboardAdmin.jsx

// Agregar estado para detección de multicuentas
const [multicuentas, setMulticuentas] = useState(null);
const [identificacionBuscar, setIdentificacionBuscar] = useState('');

// Función para buscar multicuentas
const buscarMulticuentas = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/admin/multicuentas/${identificacionBuscar}`);
    setMulticuentas(response.data);
  } catch (error) {
    console.error('Error al buscar multicuentas:', error);
  }
};

// Agregar en el JSX
<div className="admin-section">
  <h3>🔍 Detección de Multicuentas</h3>
  <div className="search-section">
    <input
      type="text"
      placeholder="Ingresa número de identificación"
      value={identificacionBuscar}
      onChange={(e) => setIdentificacionBuscar(e.target.value)}
    />
    <button onClick={buscarMulticuentas}>Buscar</button>
  </div>
  
  {multicuentas && (
    <div className="multicuentas-result">
      <h4>Resultado de búsqueda</h4>
      <p>Total de cuentas: {multicuentas.total_cuentas}</p>
      {multicuentas.tiene_multicuentas && (
        <div className="alert alert-warning">
          <strong>⚠️ Se detectaron multicuentas</strong>
          <ul>
            {multicuentas.patrones_sospechosos.map((patron, index) => (
              <li key={index}>{patron}</li>
            ))}
          </ul>
        </div>
      )}
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Fecha Creación</th>
          </tr>
        </thead>
        <tbody>
          {multicuentas.usuarios.map(usuario => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre} {usuario.apellido}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>{new Date(usuario.fecha_creacion).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
```

## Beneficios de la Implementación

### 1. **Prevención de Fraudes**
- Identificación única evita que una persona se registre múltiples veces
- Detección automática de patrones sospechosos
- Auditoría completa de cuentas por identificación

### 2. **Mejor Calidad de Datos**
- Validación estricta de formato de identificación
- Verificación de unicidad en tiempo real
- Datos más confiables para análisis

### 3. **Cumplimiento Normativo**
- Cumple con regulaciones de identificación personal
- Facilita verificaciones de identidad
- Mejora la seguridad de la plataforma

### 4. **Herramientas de Administración**
- Dashboard para detectar multicuentas
- Estadísticas de uso de identificación
- Alertas automáticas de patrones sospechosos

## Plan de Implementación

### Fase 1: Base de Datos
1. Ejecutar script de migración
2. Probar constraints y índices
3. Verificar integridad de datos existentes

### Fase 2: Backend
1. Modificar modelos y controladores
2. Implementar validaciones de unicidad
3. Agregar funciones de detección de multicuentas

### Fase 3: Frontend
1. Actualizar formularios de registro y edición
2. Implementar validaciones frontend
3. Agregar sección de administración

### Fase 4: Testing
1. Probar casos de uso normales
2. Probar detección de multicuentas
3. Validar manejo de errores

### Fase 5: Despliegue
1. Migración de datos existentes
2. Despliegue gradual
3. Monitoreo y ajustes

---

Esta implementación proporcionará una capa adicional de seguridad y control que será fundamental para mantener la integridad de la plataforma Artisa. 