import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/estilosEventos.css';

function EventoDetalles() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [tareasAsociadas, setTareasAsociadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchEventoDetalles() {
      if (!user) {
          setLoading(false);
          setError("Debe iniciar sesión para ver los detalles del evento.");
          return;
      }
      try {
        const token = localStorage.getItem('usuarioToken');
        const eventRes = await fetch(`http://localhost:3001/api/eventos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (eventRes.ok) {
          const eventData = await eventRes.json();
          setEvento(eventData);

          const tasksRes = await fetch(`http://localhost:3001/api/tareas/event/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (tasksRes.ok) {
            const tasksData = await tasksRes.json();
            setTareasAsociadas(tasksData);
          } else {
            console.error('Error al cargar tareas asociadas:', await tasksRes.json());
          }
        } else if (eventRes.status === 404) {
          setError('Evento no encontrado.');
        } else {
          setError('Error al cargar los detalles del evento.');
          console.error('Error al cargar detalles del evento:', await eventRes.json());
        }
      } catch (err) {
        console.error('Error de red al cargar detalles del evento:', err);
        setError('No se pudo conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    }

    fetchEventoDetalles();
  }, [id, user]);

  if (loading) {
    return <div className="text-center mt-5">Cargando detalles del evento...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  if (!evento) {
    return <div className="alert alert-info text-center mt-5">Evento no disponible.</div>;
  }

  return (
    <div className="fondo-personalizado" style={{ backgroundImage: 'url("/imagen/IMG_5994.JPEG")' }}>
      <div className="container-main mt-5 pt-5">
        <h2 className="mb-4 text-center">Detalles del Evento: {evento.titulo}</h2>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{evento.titulo}</h5>
            <p className="card-text"><strong>Descripción:</strong> {evento.descripcion}</p>
            <p className="card-text"><strong>Ubicación:</strong> {evento.ubicacion}</p>
            <p className="card-text"><strong>Encargado:</strong> {evento.encargado}</p>
            <p className="card-text"><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}</p>
          </div>
        </div>

        <h3 className="mb-3">Tareas Asociadas a este Evento</h3>
        {tareasAsociadas.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Asignado a</th>
                </tr>
              </thead>
              <tbody>
                {tareasAsociadas.map(tarea => (
                  <tr key={tarea.id_tarea}>
                    <td>{tarea.titulo}</td>
                    <td>{tarea.descripcion}</td>
                    <td>{tarea.estado}</td>
                    <td>{new Date(tarea.fecha).toLocaleDateString()}</td>
                    <td>{tarea.usuarioAsignadoNombre || 'Sin asignar'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No hay tareas asociadas a este evento.</p>
        )}

        <button className="btn btn-secondary mt-3" onClick={() => window.history.back()}>Volver</button>
      </div>
    </div>
  );
}

export default EventoDetalles;