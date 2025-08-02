import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({
    correo: '',
    contraseña: ''
  });
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // const { login } = useAuth();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log('Enviando datos de login:', form);
      const res = await axios.post('http://localhost:3000/api/auth/login', form);
      console.log('Respuesta del backend:', res.data);
      
      // Guardar token en localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      
      console.log('Usuario guardado en localStorage:', res.data.usuario);
      
      // Disparar evento para notificar al Header
      window.dispatchEvent(new Event('userLogin'));
      console.log('Evento userLogin disparado');
      
      setMsg('¡Inicio de sesión exitoso!');
      
      // Redirigir según rol
      if (res.data.usuario.rol === 'administrador') {
        console.log('Redirigiendo a dashboard-admin');
        navigate('/dashboard-admin');
      } else if (res.data.usuario.rol === 'artesano') {
        console.log('Redirigiendo a dashboard-artesano');
        navigate('/dashboard-artesano');
      } else {
        console.log('Redirigiendo a home');
        navigate('/');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setMsg(err.response?.data?.msg || 'Error en el inicio de sesión');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar Sesión</h1>
        <p className="login-subtitle">Accede a tu cuenta de Artisa</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <div className="input-with-icon">
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
            <label htmlFor="contraseña">Contraseña</label>
            <div className="input-with-icon">
              <input
                id="contraseña"
                name="contraseña"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                value={form.contraseña}
                onChange={handleChange}
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

          <div className="forgot-password">
            <Link to="/forgot-password" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="login-btn">
            Iniciar Sesión
          </button>

          <div className="register-link">
            ¿No tienes cuenta? <Link to="/register" className="register-text">Regístrate aquí</Link>
          </div>
        </form>

        {msg && <div className="login-msg">{msg}</div>}
      </div>
    </div>
  );
} 