// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setAuth }) {
  // Estado para los datos del formulario
  const [form, setForm] = useState({ correo: '', contraseña: '' });
  const [msg, setMsg] = useState('');
  // Maneja los cambios en los campos del formulario
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  // Maneja el envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Envía los datos al backend
      const res = await axios.post('http://localhost:3000/api/auth/login', form);
      // Guarda el token en localStorage
      localStorage.setItem('token', res.data.token);
      setAuth({ usuario: res.data.usuario, token: res.data.token });
      setMsg('¡Bienvenido!');
    } catch (err) {
      //muestra un mensaje de error si ocurre algún conflicto
      setMsg(err.response?.data?.msg || 'Error al iniciar sesión');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input name="correo" type="email" placeholder="Correo" onChange={handleChange} required />
      <input name="contraseña" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <button type="submit">Iniciar Sesión</button>
      <div>{msg}</div>
    </form>
  );
}


