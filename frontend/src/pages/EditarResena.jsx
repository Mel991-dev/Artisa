import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditarResena = () => {
  const { id_reseña } = useParams();
  const navigate = useNavigate();
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResena = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/resenas/${id_reseña}`);
        setComentario(response.data.comentario);
        setCalificacion(response.data.calificacion);
      } catch (err) {
        setError("No se pudo cargar la reseña.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResena();
  }, [id_reseña]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.put(`http://localhost:3000/api/resenas/${id_reseña}`, {
        comentario,
        calificacion,
      });
      navigate(-1); // Regresa a la página anterior
    } catch (err) {
      setError("Error al actualizar la reseña.");
    }
  };

  if (isLoading) return <div>Cargando reseña...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="editar-resena-container">
      <h2>Editar Reseña</h2>
      <form onSubmit={handleSubmit} className="editar-resena-form">
        <div className="form-group">
          <label htmlFor="comentario">Comentario:</label>
          <textarea
            id="comentario"
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            required
            rows={4}
          />
        </div>
        <div className="form-group">
          <label htmlFor="calificacion">Calificación:</label>
          <select
            id="calificacion"
            value={calificacion}
            onChange={e => setCalificacion(Number(e.target.value))}
            required
          >
            {[1,2,3,4,5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-actualizar">Actualizar Reseña</button>
      </form>
    </div>
  );
};

export default EditarResena;
