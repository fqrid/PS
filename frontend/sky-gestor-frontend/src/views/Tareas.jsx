import React, { useEffect, useState, useCallback } from 'react';
import '../styles/estilosEventos.css';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.js';

function Tareas() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [tareas, setTareas] = useState([]);
  const [tareasFiltradas, setTareasFiltradas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [fecha, setFecha] = useState('');
  const [idUsuarioAsignado, setIdUsuarioAsignado] = useState(''); // Cambiado nombre
  const [idEventoAsociado, setIdEventoAsociado] = useState(''); // Cambiado nombre
  const [modoEditar, setModoEditar] = useState(false);
  const [modoVerDetalles, setModoVerDetalles] = useState(false);
  const [tareaActual, setTareaActual] = useState(null);
  const [errores, setErrores] = useState({});
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [eventosDisponibles, setEventosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Estados para el buscador y filtros
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('todo');
  const [fechaFiltro, setFechaFiltro] = useState('');

  // Mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

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
        setTareasFiltradas(data);
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
  }, [user]);

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
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTareas();
      fetchDatosSelectores();
    }
  }, [user, fetchTareas, fetchDatosSelectores]);

  // Aplicar búsqueda y filtros
  const aplicarBusquedaYFiltros = useCallback(() => {
    if (!terminoBusqueda.trim() && !fechaFiltro) {
      setTareasFiltradas(tareas);
      return;
    }

    let tareasFiltradas = [...tareas];

    // Si hay filtro de fecha, aplicarlo primero
    if (fechaFiltro && filtroSeleccionado === 'fecha') {
      tareasFiltradas = tareas.filter(tarea =>
        tarea.fecha && tarea.fecha.split('T')[0] === fechaFiltro
      );
    }

    // Si hay término de búsqueda, aplicarlo
    if (terminoBusqueda.trim()) {
      const termino = terminoBusqueda.toLowerCase().trim();
      
      switch (filtroSeleccionado) {
        case 'todo':
          tareasFiltradas = tareasFiltradas.filter(tarea =>
            (tarea.titulo && tarea.titulo.toLowerCase().includes(termino)) ||
            (tarea.descripcion && tarea.descripcion.toLowerCase().includes(termino)) ||
            (tarea.estado && tarea.estado.toLowerCase().includes(termino)) ||
            (tarea.usuario_asignado_nombre && tarea.usuario_asignado_nombre.toLowerCase().includes(termino)) || // Cambiado
            (tarea.evento_asociado_titulo && tarea.evento_asociado_titulo.toLowerCase().includes(termino)) // Cambiado
          );
          break;
        
        case 'titulo':
          tareasFiltradas = tareasFiltradas.filter(tarea =>
            tarea.titulo && tarea.titulo.toLowerCase().includes(termino)
          );
          break;
        
        case 'descripcion':
          tareasFiltradas = tareasFiltradas.filter(tarea =>
            tarea.descripcion && tarea.descripcion.toLowerCase().includes(termino)
          );
          break;
        
        case 'estado':
          tareasFiltradas = tareasFiltradas.filter(tarea =>
            tarea.estado && tarea.estado.toLowerCase().includes(termino)
          );
          break;
        
        case 'usuario':
          tareasFiltradas = tareasFiltradas.filter(tarea =>
            tarea.usuario_asignado_nombre && tarea.usuario_asignado_nombre.toLowerCase().includes(termino) // Cambiado
          );
          break;
        
        case 'evento':
          tareasFiltradas = tareasFiltradas.filter(tarea =>
            tarea.evento_asociado_titulo && tarea.evento_asociado_titulo.toLowerCase().includes(termino) // Cambiado
          );
          break;
        
        default:
          break;
      }
    }

    setTareasFiltradas(tareasFiltradas);
  }, [tareas, terminoBusqueda, filtroSeleccionado, fechaFiltro]);

  // Efecto para aplicar búsqueda cuando cambian los términos
  useEffect(() => {
    aplicarBusquedaYFiltros();
  }, [aplicarBusquedaYFiltros]);

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setTerminoBusqueda('');
    setFechaFiltro('');
    setTareasFiltradas(tareas);
  };

  // Manejar cambio de filtro
  const manejarCambioFiltro = (filtro) => {
    setFiltroSeleccionado(filtro);
    setFechaFiltro('');
  };

  // Obtener placeholder según filtro seleccionado
  const getPlaceholder = () => {
    switch (filtroSeleccionado) {
      case 'todo':
        return 'Buscar en todos los campos...';
      case 'titulo':
        return 'Buscar por título...';
      case 'descripcion':
        return 'Buscar en descripción...';
      case 'estado':
        return 'Buscar por estado...';
      case 'usuario':
        return 'Buscar por usuario...';
      case 'evento':
        return 'Buscar por evento...';
      case 'fecha':
        return 'Seleccione una fecha...';
      default:
        return 'Buscar...';
    }
  };

  // Verificar si hay filtros activos
  const hayFiltrosActivos = () => {
    return terminoBusqueda || fechaFiltro;
  };

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
          id_usuario_asignado: idUsuarioAsignado === '' ? null : parseInt(idUsuarioAsignado), // Cambiado
          id_evento_asociado: idEventoAsociado === '' ? null : parseInt(idEventoAsociado) // Cambiado
        })
      });
      if (res.ok) {
        showNotification('Tarea agregada con éxito');
        await fetchTareas();
        setTitulo('');
        setDescripcion('');
        setEstado('pendiente');
        setFecha('');
        setIdUsuarioAsignado(''); // Cambiado
        setIdEventoAsociado(''); // Cambiado
        setErrores({});
      } else {
        const errorData = await res.json();
        if (res.status === 400) {
          showNotification(`Error de validación: ${errorData.error}`, 'error');
        } else {
          showNotification('Error: ' + (errorData.error || 'No se pudo agregar la tarea.'), 'error');
        }
      }
    } catch (error) {
      console.error('Error al agregar tarea:', error);
      showNotification('Error al conectar con el servidor.', 'error');
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
        showNotification('Tarea eliminada correctamente');
        await fetchTareas();
      } else {
        const errorData = await res.json();
        showNotification('Error al eliminar tarea: ' + (errorData.error || 'No se pudo eliminar la tarea.'), 'error');
      }
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      showNotification('Error al conectar con el servidor.', 'error');
    }
  };

  const iniciarEdicion = (tarea) => {
    setTareaActual(tarea);
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion);
    setEstado(tarea.estado);
    setFecha(tarea.fecha ? tarea.fecha.split('T')[0] : '');
    setIdUsuarioAsignado(tarea.id_usuario_asignado || ''); // Cambiado
    setIdEventoAsociado(tarea.id_evento_asociado || ''); // Cambiado
    setModoEditar(true);
    setModoVerDetalles(false);
  };

  const verDetalles = (tarea) => {
    setTareaActual(tarea);
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion);
    setEstado(tarea.estado);
    setFecha(tarea.fecha ? tarea.fecha.split('T')[0] : '');
    setIdUsuarioAsignado(tarea.id_usuario_asignado || ''); // Cambiado
    setIdEventoAsociado(tarea.id_evento_asociado || ''); // Cambiado
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
    setIdUsuarioAsignado(''); // Cambiado
    setIdEventoAsociado(''); // Cambiado
    setErrores({});
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
        return;
    }

    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch(`http://localhost:3001/api/tareas/${tareaActual.id_tarea}`, {
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
          id_usuario_asignado: idUsuarioAsignado === '' ? null : parseInt(idUsuarioAsignado), // Cambiado
          id_evento_asociado: idEventoAsociado === '' ? null : parseInt(idEventoAsociado) // Cambiado
        })
      });
      if (res.ok) {
        showNotification('Tarea actualizada correctamente');
        await fetchTareas();
        cerrarModal();
      } else {
        const errorData = await res.json();
        if (res.status === 400) {
          showNotification(`Error de validación: ${errorData.error}`, 'error');
        } else {
          showNotification('Error al actualizar tarea: ' + (errorData.error || 'No se pudo actualizar la tarea.'), 'error');
        }
      }
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      showNotification('Error al conectar con el servidor.', 'error');
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
    return (
      <div className="fondo-personalizado" style={{ overflow: 'hidden' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando tareas...</span>
          </div>
          <span className="ms-2">Cargando tareas...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="fondo-personalizado" style={{ overflow: 'hidden' }}>
        <div className="container mt-5 pt-5">
          <div className="alert alert-danger text-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {fetchError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fondo-personalizado" style={{ 
      minHeight: '100vh',
      overflow: 'hidden',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    }}>
      {/* Notificación flotante */}
      {notification.show && (
        <div className={`alert ${notification.type === 'error' ? 'alert-danger' : 'alert-success'} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`} 
             style={{ 
               zIndex: 1050, 
               minWidth: '350px',
               borderRadius: '15px',
               boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
               border: 'none',
               display: 'flex',
               alignItems: 'center',
               gap: '10px'
             }} 
             role="alert">
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: notification.type === 'error' ? '#dc3545' : '#198754',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {notification.type === 'error' ? '!' : '✓'}
          </div>
          <div style={{ flex: 1 }}>
            <strong>{notification.type === 'error' ? 'Error' : 'Éxito'}</strong>
            <div style={{ fontSize: '14px', marginTop: '2px' }}>{notification.message}</div>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setNotification({ show: false, message: '', type: '' })}
            style={{ marginLeft: '10px' }}
          ></button>
        </div>
      )}

      <div className={`container-main ${darkMode ? 'dark-mode-container' : ''}`} style={{ 
        position: 'relative', 
        zIndex: 1,
        minHeight: '100vh'
      }}>
        <div className="container mt-5 pt-5" style={{ position: 'relative', zIndex: 2 }}>
          <h2 className={`mb-4 text-center ${darkMode ? 'text-white' : 'text-dark'}`}>Gestión de Tareas</h2>
         
          {/* Formulario de agregar tarea */}
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
                value={idUsuarioAsignado} // Cambiado
                onChange={e => setIdUsuarioAsignado(e.target.value)} // Cambiado
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
                value={idEventoAsociado} // Cambiado
                onChange={e => setIdEventoAsociado(e.target.value)} // Cambiado
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

          {/* Buscador principal */}
          <div className={`card mb-4 ${darkMode ? 'bg-dark text-white' : ''}`}>
            <div className="card-body">
              <div className="row g-3 align-items-center">
                <div className="col-12 col-md-8">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    
                    {/* Mostrar input de texto o calendario según el filtro */}
                    {filtroSeleccionado === 'fecha' ? (
                      <input
                        type="date"
                        className={`form-control ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                        value={fechaFiltro}
                        onChange={(e) => setFechaFiltro(e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className={`form-control ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                        placeholder={getPlaceholder()}
                        value={terminoBusqueda}
                        onChange={(e) => setTerminoBusqueda(e.target.value)}
                      />
                    )}
                    
                    {hayFiltrosActivos() && (
                      <button
                        className="btn btn-outline-danger d-flex align-items-center"
                        type="button"
                        onClick={limpiarFiltros}
                        title="Limpiar filtros"
                        style={{ minWidth: '45px' }}
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                        <span className="ms-1 d-none d-sm-inline">Limpiar</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="col-12 col-md-4">
                  <div className="d-flex gap-2">
                    <div className="dropdown flex-grow-1">
                      <button
                        className="btn btn-outline-primary w-100 dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="bi bi-funnel me-1"></i>
                        Filtros
                      </button>
                      <ul className={`dropdown-menu ${darkMode ? 'dropdown-menu-dark' : ''}`}>
                        <li>
                          <button
                            className={`dropdown-item ${filtroSeleccionado === 'todo' ? 'active' : ''}`}
                            onClick={() => manejarCambioFiltro('todo')}
                          >
                            <i className="bi bi-search me-2"></i>
                            Buscar en todo
                          </button>
                        </li>
                        <li>
                          <button
                            className={`dropdown-item ${filtroSeleccionado === 'titulo' ? 'active' : ''}`}
                            onClick={() => manejarCambioFiltro('titulo')}
                          >
                            <i className="bi bi-tag me-2"></i>
                            Por título
                          </button>
                        </li>
                        <li>
                          <button
                            className={`dropdown-item ${filtroSeleccionado === 'estado' ? 'active' : ''}`}
                            onClick={() => manejarCambioFiltro('estado')}
                          >
                            <i className="bi bi-circle me-2"></i>
                            Por estado
                          </button>
                        </li>
                        <li>
                          <button
                            className={`dropdown-item ${filtroSeleccionado === 'fecha' ? 'active' : ''}`}
                            onClick={() => manejarCambioFiltro('fecha')}
                          >
                            <i className="bi bi-calendar me-2"></i>
                            Por fecha
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button
                            className={`dropdown-item ${filtroSeleccionado === 'descripcion' ? 'active' : ''}`}
                            onClick={() => manejarCambioFiltro('descripcion')}
                          >
                            <i className="bi bi-text-paragraph me-2"></i>
                            Por descripción
                          </button>
                        </li>
                        <li>
                          <button
                            className={`dropdown-item ${filtroSeleccionado === 'usuario' ? 'active' : ''}`}
                            onClick={() => manejarCambioFiltro('usuario')}
                          >
                            <i className="bi bi-person me-2"></i>
                            Por usuario
                          </button>
                        </li>
                        <li>
                          <button
                            className={`dropdown-item ${filtroSeleccionado === 'evento' ? 'active' : ''}`}
                            onClick={() => manejarCambioFiltro('evento')}
                          >
                            <i className="bi bi-calendar-event me-2"></i>
                            Por evento
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicador de búsqueda activa */}
              {hayFiltrosActivos() && (
                <div className="mt-2">
                  <small className={`text-muted ${darkMode ? 'text-light' : ''}`}>
                    <i className="bi bi-funnel me-1"></i>
                    {filtroSeleccionado === 'fecha' && fechaFiltro && `Filtrando por fecha: ${fechaFiltro}`}
                    {filtroSeleccionado !== 'fecha' && terminoBusqueda && `Buscando "${terminoBusqueda}" en: `}
                    {filtroSeleccionado !== 'fecha' && terminoBusqueda && (
                      <span className="badge bg-primary ms-1">
                        {filtroSeleccionado === 'todo' && 'Todos los campos'}
                        {filtroSeleccionado === 'titulo' && 'Título'}
                        {filtroSeleccionado === 'descripcion' && 'Descripción'}
                        {filtroSeleccionado === 'estado' && 'Estado'}
                        {filtroSeleccionado === 'usuario' && 'Usuario'}
                        {filtroSeleccionado === 'evento' && 'Evento'}
                      </span>
                    )}
                    <span className="badge bg-info ms-2">
                      {tareasFiltradas.length} de {tareas.length} tareas
                    </span>
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Tabla de tareas */}
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
                {tareasFiltradas.length > 0 ? (
                  tareasFiltradas.map((tarea) => (
                    <tr key={tarea.id_tarea}>
                      <td>{tarea.titulo}</td>
                      <td className="d-none d-sm-table-cell truncate-text">{tarea.descripcion}</td>
                      <td>
                        <span className={`badge bg-${estadoColor(tarea.estado)}`}>
                          {tarea.estado}
                        </span>
                      </td>
                      <td>{tarea.fecha ? tarea.fecha.split('T')[0] : ''}</td>
                      <td className="d-none d-md-table-cell">{tarea.usuario_asignado_nombre || 'N/A'}</td> {/* Cambiado */}
                      <td className="d-none d-md-table-cell">{tarea.evento_asociado_titulo || 'N/A'}</td> {/* Cambiado */}
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
                            onClick={() => eliminarTarea(tarea.id_tarea)}
                          >Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <i className="bi bi-inbox display-4 d-block text-muted mb-2"></i>
                      {hayFiltrosActivos() 
                        ? 'No se encontraron tareas que coincidan con los filtros aplicados.' 
                        : 'No hay tareas registradas.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal de edición/detalle de tarea */}
          {(modoEditar || modoVerDetalles) && (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
              <div className="modal-dialog">
                <div className={`modal-content ${darkMode ? 'bg-dark text-white' : ''}`}>
                  <form className="row g-3" onSubmit={guardarCambios}>
                    <div className="modal-header">
                      <h5 className={`modal-title ${darkMode ? 'text-white' : 'text-dark'}`}>
                        {modoEditar ? 'Editar Tarea' : 'Detalles de la Tarea'}
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
                          value={descripcion}
                          onChange={e => setDescripcion(e.target.value)}
                          rows="3"
                          required
                          disabled={modoVerDetalles}
                        />
                        {errores.descripcion && modoEditar && <div className="invalid-feedback">{errores.descripcion}</div>}
                      </div>

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

                      <div className="col-12 col-md-6">
                        <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Asignar a</label>
                        <select
                          className={`form-select ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                          value={idUsuarioAsignado} // Cambiado
                          onChange={e => setIdUsuarioAsignado(e.target.value)} // Cambiado
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
                          value={idEventoAsociado} // Cambiado
                          onChange={e => setIdEventoAsociado(e.target.value)} // Cambiado
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