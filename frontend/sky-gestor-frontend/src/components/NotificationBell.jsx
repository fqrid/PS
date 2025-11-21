// src/components/NotificationBell.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import eventosService from '../services/eventosService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const NotificationBell = () => {
  const [eventos, setEventos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const { user } = useAuth();

  const fetchEventos = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const eventosData = await eventosService.getEventosProximas24h();
      setEventos(eventosData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching eventos:', err);
      setError(err.message || 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchEventos();
      
      // Actualizar cada 5 minutos
      const interval = setInterval(fetchEventos, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, fetchEventos]);

  // Memoizar funciones de formateo para evitar recreaciones innecesarias
  const formatFecha = useCallback((fecha) => {
    const date = new Date(fecha);
    const now = new Date();
    const diffMs = date - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `En ${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `En ${diffMinutes}m`;
    } else {
      return 'Ahora';
    }
  }, []);

  const formatFechaCompleta = useCallback((fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) {
        fetchEventos(); // Actualizar al abrir
      }
      return !prev;
    });
  }, [fetchEventos]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Memoizar el número de eventos para evitar recálculos
  const eventosCount = useMemo(() => eventos.length, [eventos.length]);

  // Solo mostrar notificaciones si el usuario está autenticado
  if (!user) return null;

  return (
    <div className="notification-bell position-relative">
      <button
        className="btn btn-link position-relative"
        onClick={toggleDropdown}
        style={{ color: 'inherit', textDecoration: 'none' }}
        title="Notificaciones"
      >
        🔔
        {eventosCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {eventosCount}
            <span className="visually-hidden">notificaciones</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown position-absolute top-100 end-0 mt-2 bg-white border rounded shadow-lg" 
             style={{ minWidth: '300px', maxWidth: '400px', zIndex: 1050 }}>
          <div className="notification-header p-3 border-bottom">
            <h6 className="mb-0">Próximos Eventos (24h)</h6>
            <small className="text-muted">Eventos programados para las próximas 24 horas</small>
          </div>

          <div className="notification-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading && (
              <LoadingSpinner 
                size="sm" 
                text="Cargando eventos..." 
                centered={false}
                className="p-3"
              />
            )}

            {error && (
              <div className="p-3 text-center text-danger">
                ⚠️
                <span className="ms-2">{error}</span>
              </div>
            )}

            {!loading && !error && eventos.length === 0 && (
              <div className="p-3 text-center text-muted">
                📅
                <p className="mb-0 mt-2">No hay eventos próximos</p>
                <small>Todos los eventos están organizados</small>
              </div>
            )}

            {!loading && !error && eventos.length > 0 && (
              <div className="notification-list">
                {eventos.map((evento) => (
                  <div key={evento.id_evento} className="notification-item p-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1 text-truncate" title={evento.titulo}>
                          {evento.titulo}
                        </h6>
                        <p className="mb-1 text-muted small text-truncate" title={evento.descripcion}>
                          {evento.descripcion}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-primary fw-bold">
                            {formatFecha(evento.fecha)}
                          </small>
                          <small className="text-muted">
                            {formatFechaCompleta(evento.fecha)}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="notification-footer p-2 border-top text-center">
            <small className="text-muted">
              Actualizado: {lastUpdate ? lastUpdate.toLocaleTimeString('es-ES') : 'Nunca'}
            </small>
          </div>
        </div>
      )}

      {/* Overlay para cerrar al hacer click fuera */}
      {isOpen && (
        <button
          className="position-fixed top-0 start-0 w-100 h-100 border-0 bg-transparent"
          style={{ zIndex: 1040 }}
          onClick={closeDropdown}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              closeDropdown();
            }
          }}
          aria-label="Cerrar notificaciones"
          type="button"
        />
      )}
    </div>
  );
};

export default NotificationBell;
