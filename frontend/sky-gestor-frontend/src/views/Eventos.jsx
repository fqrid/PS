import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/estilosEventos.css';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.js';

function Eventos() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [encargado, setEncargado] = useState('');
  const [fecha, setFecha] = useState('');
  const [modoEditar, setModoEditar] = useState(false);
  const [modoVerDetalles, setModoVerDetalles] = useState(false);
  const [eventoActual, setEventoActual] = useState(null);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Estados para el buscador y filtros
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('todo'); // Predeterminado: todo
  const [fechaFiltro, setFechaFiltro] = useState(''); // Para el calendario de fecha

  // Mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchEventos = useCallback(async () => {
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
        setEventosFiltrados(data);
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
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchEventos();
    }
  }, [user, fetchEventos]);

  // Aplicar búsqueda y filtros
  const aplicarBusquedaYFiltros = useCallback(() => {
    if (!terminoBusqueda.trim() && !fechaFiltro) {
      setEventosFiltrados(eventos);
      return;
    }

    let eventosFiltrados = [...eventos];

    // Si hay filtro de fecha, aplicarlo primero
    if (fechaFiltro && filtroSeleccionado === 'fecha') {
      eventosFiltrados = eventos.filter(evento =>
        evento.fecha && evento.fecha.split('T')[0] === fechaFiltro
      );
    }

    // Si hay término de búsqueda, aplicarlo
    if (terminoBusqueda.trim()) {
      const termino = terminoBusqueda.toLowerCase().trim();
      
      switch (filtroSeleccionado) {
        case 'todo':
          eventosFiltrados = eventosFiltrados.filter(evento =>
            (evento.titulo && evento.titulo.toLowerCase().includes(termino)) ||
            (evento.descripcion && evento.descripcion.toLowerCase().includes(termino)) ||
            (evento.ubicacion && evento.ubicacion.toLowerCase().includes(termino)) ||
            (evento.encargado && evento.encargado.toLowerCase().includes(termino)) ||
            (evento.fecha && evento.fecha.toLowerCase().includes(termino))
          );
          break;
        
        case 'titulo':
          eventosFiltrados = eventosFiltrados.filter(evento =>
            evento.titulo && evento.titulo.toLowerCase().includes(termino)
          );
          break;
        
        case 'descripcion':
          eventosFiltrados = eventosFiltrados.filter(evento =>
            evento.descripcion && evento.descripcion.toLowerCase().includes(termino)
          );
          break;
        
        case 'ubicacion':
          eventosFiltrados = eventosFiltrados.filter(evento =>
            evento.ubicacion && evento.ubicacion.toLowerCase().includes(termino)
          );
          break;
        
        case 'encargado':
          eventosFiltrados = eventosFiltrados.filter(evento =>
            evento.encargado && evento.encargado.toLowerCase().includes(termino)
          );
          break;
        
        default:
          break;
      }
    }

    setEventosFiltrados(eventosFiltrados);
  }, [eventos, terminoBusqueda, filtroSeleccionado, fechaFiltro]);

  // Efecto para aplicar búsqueda cuando cambian los términos
  useEffect(() => {
    aplicarBusquedaYFiltros();
  }, [aplicarBusquedaYFiltros]);

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setTerminoBusqueda('');
    setFechaFiltro('');
    setEventosFiltrados(eventos);
  };

  // Manejar cambio de filtro
  const manejarCambioFiltro = (filtro) => {
    setFiltroSeleccionado(filtro);
    setFechaFiltro(''); // Limpiar fecha cuando se cambia el filtro
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
      case 'ubicacion':
        return 'Buscar por ubicación...';
      case 'encargado':
        return 'Buscar por encargado...';
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
    if (!titulo.trim()) erroresTemp.titulo = 'El título es obligatorio';
    if (!descripcion.trim()) erroresTemp.descripcion = 'La descripción es obligatoria';
    if (!ubicacion.trim()) erroresTemp.ubicacion = 'La ubicación es obligatoria';
    if (!encargado.trim()) erroresTemp.encargado = 'El encargado es obligatorio';
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
        body: JSON.stringify({ titulo, descripcion, ubicacion, encargado, fecha })
      });
      if (res.ok) {
        showNotification('Evento agregado con éxito');
        await fetchEventos();
        setTitulo('');
        setDescripcion('');
        setUbicacion('');
        setEncargado('');
        setFecha('');
        setErrores({});
      } else {
        const errorData = await res.json();
        showNotification(`${errorData.error || 'No se pudo agregar el evento.'}`, 'error');
      }
    } catch (error) {
      console.error('Error al agregar evento:', error);
      showNotification('Error al conectar con el servidor.', 'error');
    }
  };

  const eliminarEvento = async (id) => {
    const evento = eventos.find(e => e.id === id);
    const confirmMessage = `¿Estás seguro de que quieres eliminar el evento "${evento?.titulo}"?\n\nEsta acción no se puede deshacer.`;
    
    if (!window.confirm(confirmMessage)) return;
    
    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch(`http://localhost:3001/api/eventos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        showNotification('Evento eliminado correctamente');
        await fetchEventos();
      } else {
        const errorData = await res.json();
        showNotification(`${errorData.error || 'No se pudo eliminar el evento.'}`, 'error');
      }
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      showNotification('Error al conectar con el servidor.', 'error');
    }
  };

  const iniciarEdicion = (evento) => {
    setEventoActual(evento);
    setTitulo(evento.titulo || '');
    setDescripcion(evento.descripcion || '');
    setUbicacion(evento.ubicacion || '');
    setEncargado(evento.encargado || '');
    setFecha(evento.fecha ? evento.fecha.split('T')[0] : '');
    setModoEditar(true);
    setModoVerDetalles(false);
    setErrores({});
  };

  const verDetalles = (evento) => {
    setEventoActual(evento);
    setTitulo(evento.titulo || '');
    setDescripcion(evento.descripcion || '');
    setUbicacion(evento.ubicacion || '');
    setEncargado(evento.encargado || '');
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
    setUbicacion('');
    setEncargado('');
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
          ubicacion,
          encargado,
          fecha
        })
      });
      if (res.ok) {
        showNotification('Evento actualizado correctamente');
        await fetchEventos();
        cerrarModal();
      } else {
        const errorData = await res.json();
        showNotification(`${errorData.error || 'No se pudo actualizar el evento.'}`, 'error');
      }
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      showNotification('Error al conectar con el servidor.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="fondo-personalizado" style={{ overflow: 'hidden' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando eventos...</span>
          </div>
          <span className="ms-2">Cargando eventos...</span>
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
            <div className="col-12 col-md-6">
              <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Encargado</label>
              <input
                className={`form-control ${errores.encargado ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                value={encargado}
                onChange={e => setEncargado(e.target.value)}
                required
              />
              {errores.encargado && <div className="invalid-feedback">{errores.encargado}</div>}
            </div>
            <div className="col-12">
              <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Ubicación</label>
              <input
                className={`form-control ${errores.ubicacion ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                value={ubicacion}
                onChange={e => setUbicacion(e.target.value)}
                required
              />
              {errores.ubicacion && <div className="invalid-feedback">{errores.ubicacion}</div>}
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
                            className={`dropdown-item ${filtroSeleccionado === 'encargado' ? 'active' : ''}`}
                            onClick={() => manejarCambioFiltro('encargado')}
                          >
                            <i className="bi bi-person me-2"></i>
                            Por encargado
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
                            className={`dropdown-item ${filtroSeleccionado === 'ubicacion' ? 'active' : ''}`}
                            onClick={() => manejarCambioFiltro('ubicacion')}
                          >
                            <i className="bi bi-geo-alt me-2"></i>
                            Por ubicación
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
                        {filtroSeleccionado === 'ubicacion' && 'Ubicación'}
                        {filtroSeleccionado === 'encargado' && 'Encargado'}
                      </span>
                    )}
                    <span className="badge bg-info ms-2">
                      {eventosFiltrados.length} de {eventos.length} eventos
                    </span>
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Tabla de eventos */}
          <div className={`table-responsive ${darkMode ? 'table-dark' : 'table-light'}`}>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Título</th>
                  <th className="col-hide-mobile">Descripción</th>
                  <th className="col-hide-mobile">Ubicación</th>
                  <th className="col-hide-mobile">Encargado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.length > 0 ? (
                  eventosFiltrados.map((evento) => (
                    <tr key={evento.id}>
                      <td>{evento.titulo}</td>
                      <td className="truncate-text col-hide-mobile">{evento.descripcion}</td>
                      <td className="truncate-text col-hide-mobile">{evento.ubicacion}</td>
                      <td className="truncate-text col-hide-mobile">{evento.encargado}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <i className="bi bi-inbox display-4 d-block text-muted mb-2"></i>
                      {hayFiltrosActivos() 
                        ? 'No se encontraron eventos que coincidan con los filtros aplicados.' 
                        : 'No hay eventos registrados.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal de edición/detalle de evento */}
          {(modoEditar || modoVerDetalles) && (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
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
                        <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Encargado</label>
                        <input
                          className={`form-control ${errores.encargado && modoEditar ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                          value={encargado}
                          onChange={e => setEncargado(e.target.value)}
                          required
                          disabled={modoVerDetalles}
                        />
                        {errores.encargado && modoEditar && <div className="invalid-feedback">{errores.encargado}</div>}
                      </div>
                      <div className="col-12">
                        <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Ubicación</label>
                        <input
                          className={`form-control ${errores.ubicacion && modoEditar ? 'is-invalid' : ''} ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                          value={ubicacion}
                          onChange={e => setUbicacion(e.target.value)}
                          required
                          disabled={modoVerDetalles}
                        />
                        {errores.ubicacion && modoEditar && <div className="invalid-feedback">{errores.ubicacion}</div>}
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