// src/services/authService.js
import { API_CONFIG } from '../config/constants';

class AuthService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        console.warn('No se pudo parsear el error del servidor:', parseError);
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  }

  async login(correo, contrasena) {
    try {
      const response = await fetch(`${this.baseURL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await this.handleResponse(response);
      return data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      if (error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
      
      throw error;
    }
  }

  async register(nombre, correo, contrasena) {
    try {
      const response = await fetch(`${this.baseURL}/usuarios/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, correo, contrasena })
      });

      const data = await this.handleResponse(response);
      return data;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      
      if (error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
      
      throw error;
    }
  }
}

export default new AuthService();
