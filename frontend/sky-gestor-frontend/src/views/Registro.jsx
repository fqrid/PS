//modificacion1
//modificacio2
// sky-gestor-frontend/src/views/Registro.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import '../styles/estilosEventos.css'; // Si adaptas a Bootstrap, esta línea ya no sería necesaria


import { useTheme } from '../context/ThemeContext.js';


    try {
      const response = await fetch('http://localhost:3001/api/usuarios/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, correo, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Registro exitoso! Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        setError(data.error || 'Error en el registro. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error de red al intentar registrar:', err);
      setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center pt-5" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className={`card p-4 shadow ${darkMode ? 'bg-dark text-white' : ''}`}>
              <h2 className={`card-title text-center mb-4 ${darkMode ? 'text-white' : 'text-dark'}`}>Registrarse</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="nombre" className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className={`form-control ${darkMode ? 'bg-secondary text-white border-secondary' : ''}`}
                  />
                </div>
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
                  <small className={`form-text ${darkMode ? 'text-white-50' : 'text-muted'}`}>La contraseña debe tener al menos 8 caracteres, un símbolo y un número.</small>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">Registrar</button>
              </form>
              <p className={`text-center mt-3 ${darkMode ? 'text-white-50' : 'text-muted'}`}>
                ¿Ya tienes una cuenta? <Link to="/login" className="text-decoration-none">Inicia Sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
