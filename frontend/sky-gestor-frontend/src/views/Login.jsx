//modificacion3

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'; // Asegúrate de la extensión .js
import { useTheme } from '../context/ThemeContext.js'; // Asegúrate de la extensión .js

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode } = useTheme();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

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
        login(data.token);
        alert(data.message || 'Login exitoso!');
        navigate('/tareas');
      } else {
        setError(data.error || 'Error en el login. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error de red:', err);
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
   // QUITAMOS min-vh-100. El fondo lo maneja el body.
  // pt-5 para asegurar que el contenido no quede debajo de la Navbar fija.
  // Usamos un estilo inline para minHeight para que el d-flex tenga altura para centrar.
  <div className="login-page d-flex align-items-center justify-content-center pt-5" style={{ minHeight: 'calc(100vh - 56px)' }}>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className={`card p-4 shadow ${darkMode ? 'bg-dark text-white' : ''}`}>
            <h2 className={`card-title text-center mb-4 ${darkMode ? 'text-white' : 'text-dark'}`}>Iniciar Sesión</h2>            {error && (
              <div className="alert alert-danger" role="alert">
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
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
              >
                Ingresar
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
