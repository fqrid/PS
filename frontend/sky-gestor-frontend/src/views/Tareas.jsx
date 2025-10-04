
// sky-gestor-frontend/src/views/Tareas.jsx
import React, { useEffect, useState, useCallback } from 'react'; // <--- Añade useCallback aquí
import '../styles/estilosEventos.css'; // O tu archivo CSS para tareas
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.js';

function Tareas() {
  const { user } = useAuth(); // Obtiene el usuario logueado
  const { darkMode } = useTheme();
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [fecha, setFecha] = useState('');
  const [usuarioAsignado, setUsuarioAsignado] = useState(''); // Estado para el ID del usuario seleccionado
  const [eventoAsociado, setEventoAsociado] = useState('');    // Estado para el ID del evento seleccionado
  const [modoEditar, setModoEditar] = useState(false);
  const [modoVerDetalles, setModoVerDetalles] = useState(false);
  const [tareaActual, setTareaActual] = useState(null);
  const [errores, setErrores] = useState({});
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [eventosDisponibles, setEventosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Envuelve fetchTareas en useCallback
  const fetchTareas = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch('http://localhost:3001/api/tareas', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTareas(data);
        setFetchError(null);
      } else {
        const errorData = await res.json();
        setFetchError(errorData.error || 'Error al cargar tareas.');
        console.error('Error al cargar tareas:', errorData);
      }
    } catch (error) {
      setFetchError('No se pudo conectar con el servidor para cargar las tareas.');
      console.error('Error al cargar tareas:', error);
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Dependencia: user

  // Envuelve fetchDatosSelectores en useCallback
  const fetchDatosSelectores = useCallback(async () => {
    if (!user) return;
    try {
        const token = localStorage.getItem('usuarioToken');
        const res = await fetch('http://localhost:3001/api/tareas/select-data', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (res.ok) {
            const data = await res.json();
            setUsuariosDisponibles(data.usuarios);
            setEventosDisponibles(data.eventos);
        } else {
            console.error('Error al cargar datos de selectores:', await res.json());
        }
    } catch (error) {
        console.error('Error al cargar datos de selectores:', error);
    }
  }, [user]); // <-- Dependencia: user

  useEffect(() => {
    if (user) {
      fetchTareas();
      fetchDatosSelectores();
    }
  }, [user, fetchTareas, fetchDatosSelectores]); // <-- Añade fetchTareas y fetchDatosSelectores aquí


  const validarFormulario = () => {
    const erroresTemp = {};
    if (!titulo.trim()) {
      erroresTemp.titulo = 'El título es obligatorio';
    }
    if (!descripcion.trim()) {
      erroresTemp.descripcion = 'La descripción es obligatoria';
    }
    if (!fecha) {
      erroresTemp.fecha = 'La fecha es obligatoria';
    }
    setErrores(erroresTemp);
    return Object.keys(erroresTemp).length === 0;
  };

  const agregarTarea = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
      return;
    }
    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch('http://localhost:3001/api/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          estado,
          fecha,
          usuarioAsignadoId: usuarioAsignado === '' ? null : parseInt(usuarioAsignado),
          eventoAsociadoId: eventoAsociado === '' ? null : parseInt(eventoAsociado)
        })
      });
      if (res.ok) {
        alert('Tarea agregada con éxito');
        await fetchTareas(); // Refrescar la lista de tareas
        // Limpiar el formulario
        setTitulo('');
        setDescripcion('');
        setEstado('pendiente');
        setFecha('');
        setUsuarioAsignado('');
        setEventoAsociado('');
        setErrores({});
      } else {
        const errorData = await res.json();
        // Manejo específico de errores 400 (validación)
        if (res.status === 400) {
          alert(`Error de validación: ${errorData.error}`);
        } else {
          alert('Error: ' + (errorData.error || 'No se pudo agregar la tarea.'));
        }
      }
    } catch (error) {
      console.error('Error al agregar tarea:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  const eliminarTarea = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
    }
    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch(`http://localhost:3001/api/tareas/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('Tarea eliminada');
        await fetchTareas(); // Refrescar la lista de tareas
      } else {
        const errorData = await res.json();
        alert('Error al eliminar tarea: ' + (errorData.error || 'No se pudo eliminar la tarea.'));
      }
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  const iniciarEdicion = (tarea) => {
    setTareaActual(tarea);
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion);
    setEstado(tarea.estado);
    setFecha(tarea.fecha ? tarea.fecha.split('T')[0] : '');
    setUsuarioAsignado(tarea.usuarioAsignadoId || '');
    setEventoAsociado(tarea.eventoAsociadoId || '');
    setModoEditar(true);
    setModoVerDetalles(false);
  };

  const verDetalles = (tarea) => {
    setTareaActual(tarea);
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion);
    setEstado(tarea.estado);
    setFecha(tarea.fecha ? tarea.fecha.split('T')[0] : '');
    setUsuarioAsignado(tarea.usuarioAsignadoId || '');
    setEventoAsociado(tarea.eventoAsociadoId || '');
    setModoVerDetalles(true);
    setModoEditar(false);
  };

  const cerrarModal = () => {
    setModoEditar(false);
    setModoVerDetalles(false);
    setTareaActual(null);
    setTitulo('');
    setDescripcion('');
    setEstado('pendiente');
    setFecha('');
    setUsuarioAsignado('');
    setEventoAsociado('');
    setErrores({});
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
        return;
    }

    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch(`http://localhost:3001/api/tareas/${tareaActual.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          estado,
          fecha,
          usuarioAsignadoId: usuarioAsignado === '' ? null : parseInt(usuarioAsignado),
          eventoAsociadoId: eventoAsociado === '' ? null : parseInt(eventoAsociado)
        })
      });
      if (res.ok) {
        alert('Tarea actualizada');
        await fetchTareas(); // Refrescar la lista
        cerrarModal(); // Cerrar el modal
      } else {
        const errorData = await res.json();
          // Manejo específico de errores 400 (validación)
        if (res.status === 400) {
          alert(`Error de validación: ${errorData.error}`);
        } else {
          alert('Error al actualizar tarea: ' + (errorData.error || 'No se pudo actualizar la tarea.'));
        }
      }
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      alert('Error al conectar con el servidor.');
    }
  };
  const estadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'en progreso': return 'primary';
      case 'completada': return 'success';
      default: return 'secondary';
    }
  };


  if (loading) {
      return <div className="text-center mt-5">Cargando tareas...</div>;
  }

  if (fetchError) {
      return <div className="alert alert-danger text-center mt-5">{fetchError}</div>;
  }

    return (
        // Asegúrate de que el contenedor principal también se adapte al tema oscuro
        // Y aquí usamos el fondo personalizado, pero el container-main ahora tiene su propia lógica de color en CSS.
        // Este div solo debería proporcionar el fondo general si es que lo quieres para toda la página de tareas.
        // Si el fondo es solo para el formulario y la tabla, entonces el body lo manejaría.
        <div className="fondo-personalizado" /* style={{ backgroundImage: 'url("/imagen/IMG_5994.JPEG")' }} */ >
            {/* Aplica la clase condicional también a container-main si no está ya en estilosEventos.css */}
            {/* Si ya está en estilosEventos.css para body.modo-oscuro .container-main, entonces no necesitas esto aquí */}
            <div className={`container-main ${darkMode ? 'dark-mode-container' : ''}`}> {/* Añadida clase condicional si no está en CSS */}
                <div className="container mt-5 pt-5">
                    {/* Aplica la clase condicional al título h2 */}
                    <h2 className={`mb-4 text-center ${darkMode ? 'text-white' : 'text-dark'}`}>Gestión de Tareas</h2>

                    {/* Formulario: aplica clases condicionales a labels y inputs/selects */}
                    <form className="row g-3 mb-4" onSubmit={agregarTarea}>
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
                            />
                            {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
                        </div>

                        <div className="col-12 col-md-4">
                            <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Estado</label>
                            <select
                                className={`form-select ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                                value={estado}
                                onChange={e => setEstado(e.target.value)}
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="en progreso">En progreso</option>
                                <option value="completada">Completada</option>
                            </select>
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

                        <div className="col-12 col-md-4">
                            <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Asignar a</label>
                            <select
                                className={`form-select ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                                value={usuarioAsignado}
                                onChange={e => setUsuarioAsignado(e.target.value)}
                            >
                                <option value="">No Asignado</option>
                                {usuariosDisponibles.map(userOption => (
                                    <option key={userOption.id} value={userOption.id}>{userOption.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-4">
                            <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Asociar a Evento</label>
                            <select
                                className={`form-select ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                                value={eventoAsociado}
                                onChange={e => setEventoAsociado(e.target.value)}
                            >
                                <option value="">Sin Evento</option>
                                {eventosDisponibles.map(eventOption => (
                                    <option key={eventOption.id} value={eventOption.id}>{eventOption.titulo}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12">
                            <button type="submit" className="btn btn-custom-success w-100 w-md-auto">
                                Agregar Tarea
                            </button>
                        </div>
                    </form>

                    {/* Tabla para mostrar la lista de tareas */}
                    {/* Aplica la clase table-responsive y table-dark/table-light condicional */}
                    <div className={`table-responsive ${darkMode ? 'table-dark' : 'table-light'}`}>
                      <table className="table table-striped table-hover">
                          <thead>
                              <tr>
                                  <th>Título</th>
                                  <th className="d-none d-sm-table-cell">Descripción</th>
                                  <th>Estado</th>
                                  <th>Fecha</th>
                                  <th className="d-none d-md-table-cell">Asignado a</th>
                                  <th className="d-none d-md-table-cell">Evento Asociado</th>
                                  <th>Acciones</th>
                              </tr>
                          </thead>
                          <tbody>
                              {tareas.map((tarea) => (
                                  <tr key={tarea.id}>
                                      <td>{tarea.titulo}</td>
                                      <td className="d-none d-sm-table-cell truncate-text">{tarea.descripcion}</td>
                                      <td>
                                          <span className={`badge bg-${estadoColor(tarea.estado)}`}>
                                              {tarea.estado}
                                          </span>
                                      </td>
                                      <td>{tarea.fecha ? tarea.fecha.split('T')[0] : ''}</td>
                                      <td className="d-none d-md-table-cell">{tarea.usuarioAsignadoNombre || 'N/A'}</td>
                                      <td className="d-none d-md-table-cell">{tarea.eventoAsociadoTitulo || 'N/A'}</td>
                                      <td>
                                          <div className="d-flex flex-wrap">
                                              <button
                                                  className="btn btn-custom-action btn-sm me-1 mb-1"
                                                  onClick={() => verDetalles(tarea)}
                                              >Ver</button>
                                              <button
                                                  className="btn btn-custom-primary btn-sm me-1 mb-1"
                                                  onClick={() => iniciarEdicion(tarea)}
                                              >Editar</button>
                                              <button
                                                  className="btn btn-custom-danger btn-sm mb-1"
                                                  onClick={() => eliminarTarea(tarea.id)}
                                              >Eliminar</button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>

                    {/* Modal de edición/detalle de tarea */}
                    {(modoEditar || modoVerDetalles) && (
                        <div className="modal show d-block" tabIndex="-1">
                            <div className="modal-dialog">
                                {/* Aplica la clase condicional al modal-content */}
                                <div className={`modal-content ${darkMode ? 'bg-dark text-white' : ''}`}>
                                    <form className="row g-3" onSubmit={guardarCambios}>
                                        <div className="modal-header">
                                            {/* Aplica la clase condicional al título del modal */}
                                            <h5 className={`modal-title ${darkMode ? 'text-white' : 'text-dark'}`}>
                                                {modoEditar ? 'Editar Tarea' : 'Detalles de la Tarea'}
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={cerrarModal}
                                                // Considera añadir un data-bs-theme="dark" si quieres un botón de cierre blanco en modo oscuro
                                                // o si quieres que se vea bien en ambos modos sin el color por defecto
                                                data-bs-theme={darkMode ? 'dark' : 'light'}
                                            ></button>
                                        </div>

                                        <div className="modal-body">
                                            {/* Labels e Inputs del modal con clases condicionales */}
                                            {/* Título */}
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

                                            {/* Descripción */}
                                            <div className="col-12">
                                                <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Descripción</label>
                                                <textarea
                                                    className={`form-control ${errores.descripcion && modoEditar ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                                                    value={descripcion}
                                                    onChange={e => setDescripcion(e.target.value)}
                                                    rows="3"
                                                    required
                                                    disabled={modoVerDetalles}
                                                />
                                                {errores.descripcion && modoEditar && <div className="invalid-feedback">{errores.descripcion}</div>}
                                            </div>

                                            {/* Estado */}
                                            <div className="col-12 col-md-6">
                                                <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Estado</label>
                                                <select
                                                    className={`form-select ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                                                    value={estado}
                                                    onChange={e => setEstado(e.target.value)}
                                                    disabled={modoVerDetalles}
                                                >
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="en progreso">En progreso</option>
                                                    <option value="completada">Completada</option>
                                                </select>
                                            </div>

                                            {/* Fecha */}
                                            <div className="col-12 col-md-6">
                                                <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Fecha</label>
                                                <input
                                                    type="date"
                                                    className={`form-control ${errores.fecha && modoEditar ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                                                    value={fecha}
                                                    onChange={e => setFecha(e.target.value)}
                                                    required
                                                    disabled={modoVerDetalles}
                                                />
                                                {errores.fecha && modoEditar && <div className="invalid-feedback">{errores.fecha}</div>}
                                            </div>

                                            {/* Selectores de Asignación y Evento */}
                                            <div className="col-12 col-md-6">
                                                <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Asignar a</label>
                                                <select
                                                    className={`form-select ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                                                    value={usuarioAsignado}
                                                    onChange={e => setUsuarioAsignado(e.target.value)}
                                                    disabled={modoVerDetalles}
                                                >
                                                    <option value="">No Asignado</option>
                                                    {usuariosDisponibles.map(userOption => (
                                                        <option key={userOption.id} value={userOption.id}>{userOption.nombre}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Asociar a Evento</label>
                                                <select
                                                    className={`form-select ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                                                    value={eventoAsociado}
                                                    onChange={e => setEventoAsociado(e.target.value)}
                                                    disabled={modoVerDetalles}
                                                >
                                                    <option value="">Sin Evento</option>
                                                    {eventosDisponibles.map(eventOption => (
                                                        <option key={eventOption.id} value={eventOption.id}>{eventOption.titulo}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-custom-danger"
                                                onClick={cerrarModal}
                                            >
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

export default Tareas;
