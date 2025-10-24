import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.js';
import '../styles/estilosEventos.css';

function Usuarios() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Estados para el buscador y filtros
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('todo');

  // Mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchUsuarios = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch('http://localhost:3001/api/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
        setUsuariosFiltrados(data);
        setFetchError(null);
      } else {
        const errData = await res.json();
        setFetchError(errData.error || 'Error al cargar usuarios.');
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setFetchError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsuarios();
  }, [user, fetchUsuarios]);

  // Aplicar búsqueda y filtros
  const aplicarBusquedaYFiltros = useCallback(() => {
    if (!terminoBusqueda.trim()) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const termino = terminoBusqueda.toLowerCase().trim();
    let usuariosFiltrados = [...usuarios];

    switch (filtroSeleccionado) {
      case 'todo':
        usuariosFiltrados = usuarios.filter(usuario =>
          (usuario.id && usuario.id.toString().includes(termino)) ||
          (usuario.nombre && usuario.nombre.toLowerCase().includes(termino)) ||
          (usuario.correo && usuario.correo.toLowerCase().includes(termino))
        );
        break;
      
      case 'id':
        usuariosFiltrados = usuarios.filter(usuario =>
          usuario.id && usuario.id.toString().includes(termino)
        );
        break;
      
      case 'nombre':
        usuariosFiltrados = usuarios.filter(usuario =>
          usuario.nombre && usuario.nombre.toLowerCase().includes(termino)
        );
        break;
      
      case 'correo':
        usuariosFiltrados = usuarios.filter(usuario =>
          usuario.correo && usuario.correo.toLowerCase().includes(termino)
        );
        break;
      
      default:
        break;
    }

    setUsuariosFiltrados(usuariosFiltrados);
  }, [usuarios, terminoBusqueda, filtroSeleccionado]);

  // Efecto para aplicar búsqueda cuando cambian los términos
  useEffect(() => {
    aplicarBusquedaYFiltros();
  }, [aplicarBusquedaYFiltros]);

  // Limpiar búsqueda
  const limpiarBusqueda = () => {
    setTerminoBusqueda('');
    setUsuariosFiltrados(usuarios);
  };

  // Obtener placeholder según filtro seleccionado
  const getPlaceholder = () => {
    switch (filtroSeleccionado) {
      case 'todo':
        return 'Buscar en todos los campos...';
      case 'id':
        return 'Buscar por ID...';
      case 'nombre':
        return 'Buscar por nombre...';
      case 'correo':
        return 'Buscar por correo...';
      default:
        return 'Buscar...';
    }
  };

  // Verificar si hay filtros activos
  const hayFiltrosActivos = () => {
    return terminoBusqueda;
  };

  if (loading) {
    return (
      <div className="fondo-personalizado" style={{ overflow: 'hidden' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando usuarios...</span>
          </div>
          <span className="ms-2">Cargando usuarios...</span>
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
          <h2 className={`mb-4 text-center ${darkMode ? 'text-white' : 'text-dark'}`}>Gestión de Usuarios</h2>

          {/* Buscador principal */}
          <div className={`card mb-4 ${darkMode ? 'bg-dark text-white' : ''}`}>
            <div className="card-body">
              <div className="row g-3 align-items-center">
                <div className="col-12 col-md-8">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    
                    <input
                      type="text"
                      className={`form-control ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                      placeholder={getPlaceholder()}
                      value={terminoBusqueda}
                      onChange={(e) => setTerminoBusqueda(e.target.value)}
                    />
                    
                    {hayFiltrosActivos() && (
                      <button
                        className="btn btn-outline-danger d-flex align-items-center"
                        type="button"
                        onClick={limpiarBusqueda}
                        title="Limpiar búsqueda"
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
                            onClick={() => setFiltroSeleccionado('todo')}
                          >
                            <i className="bi bi-search me-2"></i>
                            Buscar en todo
                          </button>
                        </li>
                        <li>
                          <button
                            className={`dropdown-item ${filtroSeleccionado === 'nombre' ? 'active' : ''}`}
                            onClick={() => setFiltroSeleccionado('nombre')}
                          >
                            <i className="bi bi-person me-2"></i>
                            Por nombre
                          </button>
                        </li>
                        <li>
                          <button
                            className={`dropdown-item ${filtroSeleccionado === 'correo' ? 'active' : ''}`}
                            onClick={() => setFiltroSeleccionado('correo')}
                          >
                            <i className="bi bi-envelope me-2"></i>
                            Por correo
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button
                            className={`dropdown-item ${filtroSeleccionado === 'id' ? 'active' : ''}`}
                            onClick={() => setFiltroSeleccionado('id')}
                          >
                            <i className="bi bi-hash me-2"></i>
                            Por ID
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
                    {terminoBusqueda && `Buscando "${terminoBusqueda}" en: `}
                    {terminoBusqueda && (
                      <span className="badge bg-primary ms-1">
                        {filtroSeleccionado === 'todo' && 'Todos los campos'}
                        {filtroSeleccionado === 'id' && 'ID'}
                        {filtroSeleccionado === 'nombre' && 'Nombre'}
                        {filtroSeleccionado === 'correo' && 'Correo'}
                      </span>
                    )}
                    <span className="badge bg-info ms-2">
                      {usuariosFiltrados.length} de {usuarios.length} usuarios
                    </span>
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Tabla de usuarios */}
          <div className={`table-responsive ${darkMode ? 'table-dark' : 'table-light'}`}>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>
                        <span className="badge bg-secondary">{usuario.id}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person-circle me-2 text-primary"></i>
                          {usuario.nombre}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-envelope me-2 text-muted"></i>
                          {usuario.correo}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      <i className="bi bi-people display-4 d-block text-muted mb-2"></i>
                      {hayFiltrosActivos() 
                        ? 'No se encontraron usuarios que coincidan con la búsqueda.' 
                        : 'No hay usuarios registrados.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;