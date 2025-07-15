// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  // Estado para los datos del formulario
  const [form, setForm] = useState({ nombre: '', correo: '', contraseña: '', rol: 'comprador' });
  const [msg, setMsg] = useState('');
  // Maneja los cambios en los campos del formulario
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Envía los datos al backend
      await axios.post('http://localhost:3000/api/auth/register', form);
      setMsg('¡Registro exitoso! Ahora puedes iniciar sesión.');
    } catch (err) {
      // Muestra mensaje de error si ocurre algún problema
      setMsg(err.response?.data?.msg || 'Error en el registro');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
      <input name="correo" type="email" placeholder="Correo" onChange={handleChange} required />
      <input name="contraseña" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <select name="rol" onChange={handleChange}>
        <option value="comprador">Comprador</option>
        <option value="artesano">Artesano</option>
      </select>
      <button type="submit">Registrarse</button>
      <div>{msg}</div>
    </form>
  );
}


