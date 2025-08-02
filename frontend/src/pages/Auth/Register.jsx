import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

export default function Register() {
  // Estado para los campos básicos que existen en la BD
  const [form, setForm] = useState({
    identificacion: '',
    nombre: '',
    apellido: '',
    correo: '',
    direccion: '',
    pais: '',
    contraseña: '',
    confirmar: '',
    rol: 'comprador',
    terminos: false
  });
  
  // Estado para campos específicos de artesano (se mostrarán solo si selecciona artesano)
  const [artesanoFields, setArtesanoFields] = useState({
    especialidad: '',
    biografia: '',
    historia: ''
  });
  
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Lista de especialidades disponibles
  const especialidades = [
    'Cerámica',
    'Joyería',
    'Textiles',
    'Madera',
    'Metal',
    'Cuero',
    'Vidrio',
    'Papel y Cartón',
    'Piedra',
    'Plástico',
    'Otros'
  ];

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleArtesanoChange = e => {
    const { name, value } = e.target;
    setArtesanoFields({ ...artesanoFields, [name]: value });
  };

  const handleRole = rol => {
    setForm({ ...form, rol });
    // Limpiar campos de artesano si cambia a comprador
    if (rol === 'comprador') {
      setArtesanoFields({ especialidad: '', biografia: '', historia: '' });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validación de identificación
    if (!form.identificacion) {
      setMsg('La identificación es obligatoria.');
      return;
    }
    
    // Validar formato de identificación (solo números, 8-15 dígitos)
    const identificacionRegex = /^\d{8,15}$/;
    if (!identificacionRegex.test(form.identificacion)) {
      setMsg('La identificación debe contener solo números (8-15 dígitos).');
      return;
    }
    
    if (!form.terminos) {
      setMsg('Debes aceptar los términos y condiciones.');
      return;
    }
    
    if (form.contraseña !== form.confirmar) {
      setMsg('Las contraseñas no coinciden.');
      return;
    }
    
    if (form.contraseña.length < 8) {
      setMsg('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Validaciones específicas para artesanos
    if (form.rol === 'artesano') {
      if (!artesanoFields.especialidad) {
        setMsg('Debes seleccionar una especialidad.');
        return;
      }
      
      if (artesanoFields.biografia.length < 50) {
        setMsg('La biografía debe tener al menos 50 caracteres.');
        return;
      }
      
      if (artesanoFields.biografia.length > 500) {
        setMsg('La biografía no puede exceder 500 caracteres.');
        return;
      }
      
      if (artesanoFields.historia.length < 100) {
        setMsg('La historia debe tener al menos 100 caracteres.');
        return;
      }
      
      if (artesanoFields.historia.length > 1000) {
        setMsg('La historia no puede exceder 1000 caracteres.');
        return;
      }
    }

    try {
      const userData = {
        identificacion: form.identificacion,
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        direccion: form.direccion,
        pais: form.pais,
        contraseña: form.contraseña,
        rol: form.rol,
        // Solo agrega estos si el rol es artesano
        ...(form.rol === 'artesano' && {
          especialidad: artesanoFields.especialidad,
          biografia: artesanoFields.biografia,
          historia: artesanoFields.historia
        })
      };

      console.log(userData);
      await axios.post('http://localhost:3000/api/auth/register', userData);
      setMsg('¡Registro exitoso! Ahora puedes iniciar sesión.');
      
      // Si es artesano, podríamos redirigir a completar perfil
      if (form.rol === 'artesano') {
        // Aquí podrías redirigir a completar perfil de artesano
        console.log('Datos de artesano para completar perfil:', artesanoFields);
      }
    } catch (err) {
      if (err.response?.data?.errores) {
        // Si hay errores específicos (como identificación duplicada)
        const errores = err.response.data.errores;
        setMsg(errores.join(', '));
      } else {
        setMsg(err.response?.data?.msg || 'Error en el registro');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Únete a Artisa</h1>
        <p className="register-subtitle">Crea tu cuenta y forma parte de nuestra comunidad artesanal</p>
        
        <form onSubmit={handleSubmit} className="register-form">
          {/* Selección de rol con radio buttons */}
          <div className="form-group">
            <label>¿Cómo quieres usar Artisa? *</label>
            <div className="role-options">
              <div className={`role-card${form.rol === 'comprador' ? ' selected' : ''}`} onClick={() => handleRole('comprador')}>
                <input 
                  type="radio" 
                  name="rol" 
                  value="comprador"
                  checked={form.rol === 'comprador'}
                  readOnly
                />
                <div>
                  <b>Comprador</b>
                  <div className="role-description">Quiero comprar productos artesanales únicos</div>
                </div>
              </div>
              <div className={`role-card${form.rol === 'artesano' ? ' selected' : ''}`} onClick={() => handleRole('artesano')}>
                <input 
                  type="radio" 
                  name="rol" 
                  value="artesano"
                  checked={form.rol === 'artesano'}
                  readOnly
                />
                <div>
                  <b>Artesano</b>
                  <div className="role-description">Quiero vender mis productos artesanales</div>
                </div>
              </div>
            </div>
          </div>

          {/* Información personal */}
          <div className="form-group">
            <label htmlFor="identificacion">Identificación *</label>
            <div className="input-with-icon">
              <span className="input-icon">🆔</span>
              <input
                id="identificacion"
                name="identificacion"
                type="text"
                placeholder="Número de identificación (solo números)"
                value={form.identificacion}
                onChange={handleChange}
                pattern="[0-9]{8,15}"
                title="Ingresa solo números (8-15 dígitos)"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido *</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="Tu apellido"
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
                placeholder="tu@email.com"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección *</label>
            <div className="input-with-icon">
              <span className="input-icon">📍</span>
              <input
                id="direccion"
                name="direccion"
                type="text"
                placeholder="Tu dirección completa"
                value={form.direccion}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pais">País *</label>
            <div className="input-with-icon">
              <span className="input-icon">🌍</span>
              <input
                id="pais"
                name="pais"
                type="text"
                placeholder="Tu país"
                value={form.pais}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contraseña">Contraseña *</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                id="contraseña"
                name="contraseña"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                value={form.contraseña}
                onChange={handleChange}
                minLength={8}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmar">Confirmar Contraseña *</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                id="confirmar"
                name="confirmar"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                value={form.confirmar}
                onChange={handleChange}
                minLength={8}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Campos específicos de artesano - solo se muestran si selecciona artesano */}
          {form.rol === 'artesano' && (
            <>
              <div className="form-group">
                <label htmlFor="especialidad">Especialidad *</label>
                <div className="input-with-icon">
                  <span className="input-icon">🎨</span>
                  <select
                    id="especialidad"
                    name="especialidad"
                    value={artesanoFields.especialidad}
                    onChange={handleArtesanoChange}
                    required
                  >
                    <option value="">Selecciona tu especialidad</option>
                    {especialidades.map((especialidad, index) => (
                      <option key={index} value={especialidad}>
                        {especialidad}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="biografia">Biografía *</label>
                <div className="input-with-icon">
                  <span className="input-icon">📝</span>
                  <textarea
                    id="biografia"
                    name="biografia"
                    placeholder="Cuéntanos sobre ti y tu experiencia... (mínimo 50, máximo 500 caracteres)"
                    value={artesanoFields.biografia}
                    onChange={handleArtesanoChange}
                    rows="3"
                    minLength={50}
                    maxLength={500}
                    required
                  />
                  <div className="character-count">
                    {artesanoFields.biografia.length}/500 caracteres
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="historia">Historia de tu Artesanía *</label>
                <div className="input-with-icon">
                  <span className="input-icon">📖</span>
                  <textarea
                    id="historia"
                    name="historia"
                    placeholder="Comparte la historia detrás de tus creaciones... (mínimo 100, máximo 1000 caracteres)"
                    value={artesanoFields.historia}
                    onChange={handleArtesanoChange}
                    rows="4"
                    minLength={100}
                    maxLength={1000}
                    required
                  />
                  <div className="character-count">
                    {artesanoFields.historia.length}/1000 caracteres
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="checkbox-row">
            <input type="checkbox" name="terminos" checked={form.terminos} onChange={handleChange} required />
            <label>Acepto los <a href="#" className="link-accent">términos y condiciones</a> y la <a href="#" className="link-accent">política de privacidad</a> de Artisa *</label>
          </div>

          <button type="submit" className="register-btn">
            Crear Mi Cuenta
          </button>

          <div className="login-link">
            ¿Ya tienes cuenta? <Link to="/login" className="login-text">Inicia sesión aquí</Link>
          </div>
        </form>

        {msg && <div className="register-msg">{msg}</div>}
      </div>
    </div>
  );
} 