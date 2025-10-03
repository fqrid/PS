//E
// sky-gestor-frontend/src/views/Eventos.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/estilosEventos.css'; // Asegúrate de que este CSS contiene los estilos base y los del modo oscuro si los has centralizado aquí
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.js'; // <-- Importa useTheme

function Eventos() {
  const { user } = useAuth();
  const { darkMode } = useTheme();//obtiene el estado del modo oscuro
  const [eventos, setEventos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [modoEditar, setModoEditar] = useState(false);
  const [modoVerDetalles, setModoVerDetalles] = useState(false);
  const [eventoActual, setEventoActual] = useState(null);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Envuelve fetchEventos en useCallback
  const fetchEventos = useCallback(async () => { // <-- useCallback aquí
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch('http://localhost:3001/api/eventos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setEventos(data);
        setFetchError(null);
      } else {
        const errorData = await res.json();
        setFetchError(errorData.error || 'Error al cargar eventos.');
        console.error('Error al cargar eventos:', errorData);
      }
    } catch (error) {
      setFetchError('No se pudo conectar con el servidor para cargar los eventos.');
      console.error('Error al cargar eventos:', error);
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Dependencia de useCallback

  useEffect(() => {
    if (user) {
      fetchEventos();
    }
  }, [user, fetchEventos]);


  const validarFormulario = () => {
    const erroresTemp = {};
    if (!titulo.trim()) erroresTemp.titulo = 'El título es obligatorio';
    if (!descripcion.trim()) erroresTemp.descripcion = 'La descripción es obligatoria';
    if (!fecha) erroresTemp.fecha = 'La fecha es obligatoria';
    setErrores(erroresTemp);
    return Object.keys(erroresTemp).length === 0;
  };

  const agregarEvento = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch('http://localhost:3001/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, descripcion, fecha })
      });
      if (res.ok) {
        alert('Evento agregado con éxito');
        await fetchEventos();
        setTitulo('');
        setDescripcion('');
        setFecha('');
        setErrores({});
      } else {
        const errorData = await res.json();
        alert('Error: ' + (errorData.error || 'No se pudo agregar el evento.'));
      }
    } catch (error) {
      console.error('Error al agregar evento:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  const eliminarEvento = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) return;
    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch(`http://localhost:3001/api/eventos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('Evento eliminado');
        await fetchEventos();
      } else {
        const errorData = await res.json();
        alert('Error al eliminar evento: ' + (errorData.error || 'No se pudo eliminar el evento.'));
      }
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      alert('Error al conectar con el servidor.');
    }
  };


  const iniciarEdicion = (evento) => {
    setEventoActual(evento);
    setTitulo(evento.titulo || '');
    setDescripcion(evento.descripcion || '');
    // Asegura que la fecha esté en formato YYYY-MM-DD o cadena vacía
    setFecha(evento.fecha ? evento.fecha.split('T')[0] : '');
    setModoEditar(true);
    setModoVerDetalles(false);
    setErrores({});
  };

  const verDetalles = (evento) => {
    setEventoActual(evento);
    setTitulo(evento.titulo || '');
    setDescripcion(evento.descripcion || '');
    setFecha(evento.fecha ? evento.fecha.split('T')[0] : '');
    setModoVerDetalles(true);
    setModoEditar(false);
    setErrores({});
  };

  const cerrarModal = () => {
    setModoEditar(false);
    setModoVerDetalles(false);
    setEventoActual(null);
    setTitulo('');
    setDescripcion('');
    setFecha('');
    setErrores({});
  };


  const guardarCambios = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch(`http://localhost:3001/api/eventos/${eventoActual.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          fecha
        })
      });
      if (res.ok) {
        alert('Evento actualizado');
        await fetchEventos();
        cerrarModal();
      } else {
        const errorData = await res.json();
        alert('Error al actualizar evento: ' + (errorData.error || 'No se pudo actualizar el evento.'));
      }
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando eventos...</div>;
  }

  if (fetchError) {
    return <div className="alert alert-danger text-center mt-5">{fetchError}</div>;
  }

  return (
    <div className="fondo-personalizado">
      <div className={`container-main ${darkMode ? 'dark-mode-container' : ''}`}>
        <div className="container mt-5 pt-5">
          <h2 className={`mb-4 text-center ${darkMode ? 'text-white' : 'text-dark'}`}>Gestión de Eventos</h2>

          {/* Formulario de agregar evento */}
          <form className="row g-3 mb-4" onSubmit={agregarEvento}>
            <div className="col-12 col-md-6">
              <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Título</label>
              <input
                className={`form-control ${errores.titulo ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                required
              />
              {errores.titulo && <div className="invalid-feedback">{errores.titulo}</div>}
            </div>
            <div className="col-12">
              <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Descripción</label>
              <textarea
                className={`form-control ${errores.descripcion ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                rows="3"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                required
              ></textarea>
              {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
            </div>
            <div className="col-12 col-md-4">
              <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Fecha</label>
              <input type="date"
                className={`form-control ${errores.fecha ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                required
              />
              {errores.fecha && <div className="invalid-feedback">{errores.fecha}</div>}
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-custom-success w-100 w-md-auto">
                Agregar Evento
              </button>
            </div>
          </form>


          {/* Tabla de eventos */}
          <div className={`table-responsive ${darkMode ? 'table-dark' : 'table-light'}`}>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Título</th>
                  <th className="col-hide-mobile">Descripción</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map((evento) => (
                  <tr key={evento.id}>
                    <td>{evento.titulo}</td>
                    <td className="truncate-text col-hide-mobile">{evento.descripcion}</td>
                    <td>{evento.fecha ? evento.fecha.split('T')[0] : ''}</td>
                    <td>
                      <div className="d-flex flex-wrap">
                        <button
                          className="btn btn-custom-action btn-sm me-1 mb-1"
                          onClick={() => verDetalles(evento)}
                        >Ver Detalles</button>
                        <button
                          className="btn btn-custom-primary btn-sm me-1 mb-1"
                          onClick={() => iniciarEdicion(evento)}
                        >Editar</button>
                        <button
                          className="btn btn-custom-danger btn-sm mb-1"
                          onClick={() => eliminarEvento(evento.id)}
                        >Eliminar</button>
                        <Link to={`/eventos/${evento.id}`} className="btn btn-info btn-sm">Ver Tareas</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

           {/* Modal de edición/detalle de evento */}
          {(modoEditar || modoVerDetalles) && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className={`modal-content ${darkMode ? 'bg-dark text-white' : ''}`}>
                  <form className="row g-3" onSubmit={guardarCambios}>
                    <div className="modal-header">
                      <h5 className={`modal-title ${darkMode ? 'text-white' : 'text-dark'}`}>
                        {modoEditar ? 'Editar Evento' : 'Detalles del Evento'}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={cerrarModal}
                        data-bs-theme={darkMode ? 'dark' : 'light'}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="col-12">
                        <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Título</label>
                        <input
                          className={`form-control ${errores.titulo && modoEditar ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                          value={titulo}
                          onChange={e => setTitulo(e.target.value)}
                          required
                          disabled={modoVerDetalles}
                        />
                        {errores.titulo && modoEditar && <div className="invalid-feedback">{errores.titulo}</div>}
                      </div>
                      <div className="col-12">
                        <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Descripción</label>
                        <textarea
                          className={`form-control ${errores.descripcion && modoEditar ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                          rows="3"
                          value={descripcion}
                          onChange={e => setDescripcion(e.target.value)}
                          required
                          disabled={modoVerDetalles}
                        ></textarea>
                        {errores.descripcion && modoEditar && <div className="invalid-feedback">{errores.descripcion}</div>}
                      </div>
                      <div className="col-12 col-md-6">
                        <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Fecha</label>
                        <input type="date"
                          className={`form-control ${errores.fecha && modoEditar ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                          value={fecha}
                          onChange={e => setFecha(e.target.value)}
                          required
                          disabled={modoVerDetalles}
                        />
                        {errores.fecha && modoEditar && <div className="invalid-feedback">{errores.fecha}</div>}
                      </div>

                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-custom-danger" onClick={cerrarModal}>
                        {modoEditar ? 'Cancelar' : 'Cerrar'}
                      </button>
                      {modoEditar && (
                        <button type="submit" className="btn btn-custom-primary">
                          Guardar cambios
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Eventos;
