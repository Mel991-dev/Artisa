import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditarArtesano.css';

export default function EditarArtesano() {
  const navigate = useNavigate();
  const { id_usuario } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [errores, setErrores] = useState([]);
  
  // Estado para datos del formulario
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    direccion: '',
    pais: '',
    rol: '',
    contraseña: '',
    confirmarContraseña: ''
  });
  
  // Estado para datos específicos de artesano
  const [artesanoFields, setArtesanoFields] = useState({
    especialidad: '',
    biografia: '',
    historia: ''
  });
  
  const [usuario, setUsuario] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [fotoActual, setFotoActual] = useState(null);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    cargarUsuario();
  }, [id_usuario]);

  const cargarUsuario = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Cargando usuario con ID:', id_usuario);
      
      if (!token) {
        console.log('No hay token, redirigiendo a login');
        navigate('/login');
        return;
      }

      // Configurar headers de autorización
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Obtener datos básicos del usuario
      const responseUsuario = await axios.get(`http://localhost:3000/api/admin/usuarios/${id_usuario}`);
      const datosUsuario = responseUsuario.data;
      
      console.log('Datos del usuario cargados:', datosUsuario);
      setUsuario(datosUsuario);
      
      // Establecer foto actual si existe
      if (datosUsuario.foto_perfil) {
        setFotoActual(`http://localhost:3000/uploads/${datosUsuario.foto_perfil}`);
      }
      
      // Llenar formulario con datos existentes
      setForm({
        nombre: datosUsuario.nombre || '',
        apellido: datosUsuario.apellido || '',
        correo: datosUsuario.correo || '',
        direccion: datosUsuario.direccion || '',
        pais: datosUsuario.pais || '',
        rol: datosUsuario.rol || '',
        contraseña: '',
        confirmarContraseña: ''
      });

      // Si es artesano, cargar datos específicos
      if (datosUsuario.rol === 'artesano') {
        try {
          const responseArtesano = await axios.get(`http://localhost:3000/api/admin/artesanos/${id_usuario}`);
          const datosArtesano = responseArtesano.data;
          
          setArtesanoFields({
            especialidad: datosArtesano.especialidad || '',
            biografia: datosArtesano.biografia || '',
            historia: datosArtesano.historia || ''
          });
        } catch (err) {
          console.error('Error al cargar datos de artesano:', err);
          setArtesanoFields({
            especialidad: '',
            biografia: '',
            historia: ''
          });
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error al cargar usuario:', err);
      setMsg('Error al cargar el usuario. Inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Si cambia el rol, limpiar campos de artesano si no es artesano
    if (name === 'rol' && value !== 'artesano') {
      setArtesanoFields({
        especialidad: '',
        biografia: '',
        historia: ''
      });
    }
  };

  const handleArtesanoChange = e => {
    const { name, value } = e.target;
    setArtesanoFields(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setMsg('Por favor selecciona solo archivos de imagen.');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMsg('La imagen debe ser menor a 5MB.');
        return;
      }
      
      setFotoPerfil(file);
      const reader = new FileReader();
      reader.onload = e => setPreviewFoto(e.target.result);
      reader.readAsDataURL(file);
      setMsg(''); // Limpiar mensajes anteriores
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrores([]);
    setMsg('');

    // Validaciones
    const nuevosErrores = [];
    
    if (!form.nombre || form.nombre.length < 2) {
      nuevosErrores.push('El nombre debe tener al menos 2 caracteres.');
    }
    
    if (!form.apellido || form.apellido.length < 2) {
      nuevosErrores.push('El apellido debe tener al menos 2 caracteres.');
    }
    
    if (!form.correo || !form.correo.includes('@')) {
      nuevosErrores.push('El correo electrónico es obligatorio y debe ser válido.');
    }
    
    if (!form.direccion || form.direccion.length < 5) {
      nuevosErrores.push('La dirección debe tener al menos 5 caracteres.');
    }
    
    if (!form.pais || form.pais.length < 2) {
      nuevosErrores.push('El país es obligatorio.');
    }
    
    if (!form.rol) {
      nuevosErrores.push('El rol es obligatorio.');
    }
    
    if (form.contraseña && form.contraseña.length < 8) {
      nuevosErrores.push('La contraseña debe tener al menos 8 caracteres.');
    }
    
    if (form.contraseña && form.contraseña !== form.confirmarContraseña) {
      nuevosErrores.push('Las contraseñas no coinciden.');
    }

    // Validaciones específicas para artesano
    if (form.rol === 'artesano') {
      if (!artesanoFields.especialidad || artesanoFields.especialidad.length < 3) {
        nuevosErrores.push('La especialidad es obligatoria y debe tener al menos 3 caracteres.');
      }
      
      if (!artesanoFields.biografia || artesanoFields.biografia.length < 10 || artesanoFields.biografia.length > 500) {
        nuevosErrores.push('La biografía debe tener entre 10 y 500 caracteres.');
      }
      
      if (!artesanoFields.historia || artesanoFields.historia.length < 10 || artesanoFields.historia.length > 1000) {
        nuevosErrores.push('La historia debe tener entre 10 y 1000 caracteres.');
      }
    }

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Crear FormData para enviar datos y foto
      const formData = new FormData();
      
      // Agregar datos del formulario
      formData.append('nombre', form.nombre);
      formData.append('apellido', form.apellido);
      formData.append('correo', form.correo);
      formData.append('direccion', form.direccion);
      formData.append('pais', form.pais);
      formData.append('rol', form.rol);
      
      // Agregar contraseña solo si se proporcionó
      if (form.contraseña) {
        formData.append('contraseña', form.contraseña);
      }
      
      // Agregar datos de artesano si aplica
      if (form.rol === 'artesano') {
        formData.append('especialidad', artesanoFields.especialidad);
        formData.append('biografia', artesanoFields.biografia);
        formData.append('historia', artesanoFields.historia);
      }
      
      // Agregar foto si se seleccionó una nueva
      if (fotoPerfil) {
        formData.append('foto', fotoPerfil);
      }

      console.log('Enviando datos al servidor:', {
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        direccion: form.direccion,
        pais: form.pais,
        rol: form.rol,
        especialidad: form.rol === 'artesano' ? artesanoFields.especialidad : undefined,
        biografia: form.rol === 'artesano' ? artesanoFields.biografia : undefined,
        historia: form.rol === 'artesano' ? artesanoFields.historia : undefined,
        tieneFoto: !!fotoPerfil
      });

      // Usar el endpoint de actualización de perfil
      const response = await axios.put(`http://localhost:3000/api/admin/usuarios/${id_usuario}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Respuesta del servidor:', response.data);
      
      // Mensaje específico según el cambio de rol
      if (usuario?.rol !== form.rol) {
        setMsg(`¡Perfil actualizado correctamente! Rol cambiado de ${usuario?.rol} a ${form.rol}.`);
      } else {
        setMsg('¡Perfil actualizado correctamente!');
      }
      
      // Actualizar usuario en localStorage con la nueva información
      const usuarioActualizado = { 
        ...usuario, 
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        direccion: form.direccion,
        pais: form.pais,
        rol: form.rol,
        foto_perfil: response.data.foto_perfil || usuario.foto_perfil
      };
      
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      // Disparar evento para actualizar el header
      window.dispatchEvent(new Event('userLogin'));
      
      // Limpiar contraseñas y foto temporal
      setForm(prev => ({ ...prev, contraseña: '', confirmarContraseña: '' }));
      setFotoPerfil(null);
      setPreviewFoto(null);
      
      // Esperar un momento y luego regresar al dashboard
      setTimeout(() => {
        navigate('/dashboard-admin');
      }, 2000);
      
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      if (err.response?.data?.errores) {
        setErrores(err.response.data.errores);
      } else {
        setMsg(err.response?.data?.msg || 'Error al actualizar el perfil. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelar = () => {
    navigate('/dashboard-admin');
  };

  if (isLoading) {
    return (
      <div className="editar-artesano-container">
        <div className="editar-artesano-card">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Cargando perfil...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editar-artesano-container">
      <div className="editar-artesano-card">
        <h1 className="editar-artesano-title">Editar Artesano</h1>
        <p className="editar-artesano-subtitle">Modifica la información del artesano ID: {id_usuario}</p>
        
        {/* Sección de foto de perfil */}
        <div className="foto-perfil-section">
          <div className="foto-perfil-container">
            <img
              src={previewFoto || fotoActual || '/img/user-default.png'}
              alt="Foto de perfil"
              className="foto-perfil"
            />
            <label htmlFor="foto-input" className="foto-perfil-btn">
              📷
            </label>
            <input
              id="foto-input"
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              style={{ display: 'none' }}
            />
          </div>
          <p className="foto-perfil-instruction">Haz clic en el ícono para cambiar la foto</p>
          {fotoPerfil && (
            <p className="foto-perfil-info">Nueva foto seleccionada: {fotoPerfil.name}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="editar-artesano-form">
          {/* Mensajes de error */}
          {errores.length > 0 && (
            <div className="error-messages">
              {errores.map((error, index) => (
                <div key={index} className="error-message">{error}</div>
              ))}
            </div>
          )}

          {/* Mensaje de éxito */}
          {msg && (
            <div className="success-message">{msg}</div>
          )}

          {/* Información Personal */}
          <div className="form-section">
            <h2 className="section-title">Información Personal</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="apellido">Apellido *</label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico *</label>
              <div className="input-with-icon">
                <span className="input-icon">📧</span>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  value={form.correo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección *</label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                value={form.direccion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pais">País *</label>
              <input
                id="pais"
                name="pais"
                type="text"
                value={form.pais}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rol">Rol *</label>
              <select
                id="rol"
                name="rol"
                value={form.rol}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona el rol</option>
                <option value="comprador">Comprador</option>
                <option value="artesano">Artesano</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contraseña">Contraseña</label>
                <input
                  id="contraseña"
                  name="contraseña"
                  type="password"
                  value={form.contraseña}
                  onChange={handleChange}
                  placeholder="Dejar vacío para mantener la actual"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmarContraseña">Confirmar Contraseña</label>
                <input
                  id="confirmarContraseña"
                  name="confirmarContraseña"
                  type="password"
                  value={form.confirmarContraseña}
                  onChange={handleChange}
                  placeholder="Confirmar nueva contraseña"
                />
              </div>
            </div>
          </div>

          {/* Información Profesional (solo para artesanos) */}
          {form.rol === 'artesano' && (
            <div className="form-section artesano-section">
              <h2 className="section-title">Información Profesional</h2>
              
              <div className="form-group">
                <label htmlFor="especialidad">Especialidad Artesanal *</label>
                <select
                  id="especialidad"
                  name="especialidad"
                  value={artesanoFields.especialidad}
                  onChange={handleArtesanoChange}
                  required
                >
                  <option value="">Selecciona tu especialidad</option>
                  <option value="Joyería">Joyería</option>
                  <option value="Cerámica">Cerámica</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Madera">Madera</option>
                  <option value="Cuero">Cuero</option>
                  <option value="Metal">Metal</option>
                  <option value="Vidrio">Vidrio</option>
                  <option value="Papel">Papel</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="biografia">Biografía *</label>
                <textarea
                  id="biografia"
                  name="biografia"
                  value={artesanoFields.biografia}
                  onChange={handleArtesanoChange}
                  placeholder="Cuéntanos sobre tu experiencia y especialización..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="historia">Tu Historia *</label>
                <textarea
                  id="historia"
                  name="historia"
                  value={artesanoFields.historia}
                  onChange={handleArtesanoChange}
                  placeholder="Comparte tu historia, inspiración y el legado de tu trabajo artesanal..."
                  rows="6"
                  required
                />
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="form-actions">
            <button type="submit" className="btn-guardar" disabled={isSubmitting}>
              💾 Guardar Cambios
            </button>
            <button type="button" className="btn-cancelar" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 