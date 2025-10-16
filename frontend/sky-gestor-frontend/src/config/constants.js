// src/config/constants.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3
};

export const NOTIFICATION_CONFIG = {
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutos
  MAX_EVENTS_DISPLAY: 10,
  ANIMATION_DURATION: 300
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'No se pudo conectar con el servidor. Verifica tu conexión.',
  AUTH_ERROR: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
  GENERIC_ERROR: 'Ha ocurrido un error inesperado',
  LOADING_ERROR: 'Error al cargar los datos',
  SAVE_ERROR: 'Error al guardar los datos'
};

export const DATE_FORMATS = {
  LOCALE: 'es-ES',
  TIME_OPTIONS: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
};

export const ACCESSIBILITY = {
  ARIA_LABELS: {
    NOTIFICATION_BELL: 'Notificaciones',
    CLOSE_NOTIFICATIONS: 'Cerrar notificaciones',
    LOADING_EVENTS: 'Cargando eventos'
  },
  KEYBOARD_SHORTCUTS: {
    ESCAPE: 'Escape',
    ENTER: 'Enter',
    SPACE: ' '
  }
};
