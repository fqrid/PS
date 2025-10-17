import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        login(data.token);
        
        // Mostrar mensaje de éxito y redirigir automáticamente después de 2 segundos
        setTimeout(() => {
          navigate('/tareas');
        }, 2000);
      } else {
        setError(data.error || 'Error en el login. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error de red:', err);
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center pt-5" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className={`card p-4 shadow ${darkMode ? 'bg-dark text-white' : ''}`}>
              <h2 className={`card-title text-center mb-4 ${darkMode ? 'text-white' : 'text-dark'}`}>Iniciar Sesión</h2>
              
              {/* Notificación de éxito */}
              {success && (
                <div className="alert alert-success d-flex align-items-center" role="alert">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <div>
                    <strong>¡Login exitoso!</strong> Redirigiendo a tu dashboard...
                  </div>
                </div>
              )}
              
              {/* Notificación de error */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="correo" className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    className={`form-control ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                    disabled={loading || success}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contrasena" className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="contrasena"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                    className={`form-control ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                    disabled={loading || success}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={loading || success}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Iniciando sesión...
                    </>
                  ) : success ? (
                    <>
                      <i className="bi bi-check-circle-fill me-2"></i>
                      ¡Éxito!
                    </>
                  ) : (
                    'Ingresar'
                  )}
                </button>
              </form>
              <p className={`text-center mt-3 ${darkMode ? 'text-white-50' : 'text-muted'}`}>
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="text-decoration-none">Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;