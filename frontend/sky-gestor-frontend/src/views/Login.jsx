// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { login } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await login(correo, contrasena);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fondo-personalizado"
      style={{
        backgroundImage: 'url("/imagen/fondo.jpg")',
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "60px"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">

            <div className={`card p-4 shadow ${darkMode ? 'bg-dark text-white' : ''}`}>
              <h2 className={`card-title text-center mb-4 ${darkMode ? 'text-white' : 'text-dark'}`}>
                Iniciar Sesión
              </h2>

              {success && (
                <div className="alert alert-success d-flex align-items-center" role="alert">
                  <div className="spinner-border spinner-border-sm me-2"></div>
                  <strong>¡Login exitoso!</strong> Redirigiendo...
                </div>
              )}

              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
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

                <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading || success}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Iniciando sesión...
                    </>
                  ) : success ? (
                    <>
                      <i className="bi bi-check-circle-fill me-2"></i>
                      ¡Éxito!
                    </>
                  ) : (
                    "Ingresar"
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
};

export default Login;
