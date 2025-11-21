// src/services/eventosService.js
import { API_CONFIG } from '../config/constants';

class EventosService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }
  async getAuthHeaders() {
    const token = localStorage.getItem('usuarioToken');
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        // Si no se puede parsear el error, usar el mensaje por defecto
        console.warn('No se pudo parsear el error del servidor:', parseError);
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  }

  async getEventosProximas24h() {
    try {
      const response = await fetch(`${this.baseURL}/eventos/proximas-24h`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al obtener eventos próximos:', error);
      
      // Manejo específico de errores
      if (error.message.includes('token')) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
      
      throw error;
    }
  }

  async getAllEventos() {
    try {
      const response = await fetch(`${this.baseURL}/eventos`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      
      if (error.message.includes('token')) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
      
      throw error;
    }
  }

  // Método para verificar la conectividad
  async checkConnection() {
    try {
      const response = await fetch(`${this.baseURL}/eventos`, {
        method: 'HEAD',
        headers: await this.getAuthHeaders()
      });
      return response.ok;
    } catch (error) {
      console.warn('Error checking connection:', error);
      return false;
    }
  }
}

export default new EventosService();
