// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';
import NotificationBell from './NotificationBell.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme(); // Asegúrate de que toggleDarkMode esté disponible

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // **CAMBIO CRÍTICO AQUÍ:** Aplica las clases de fondo y color de texto DINÁMICAMENTE
    <nav className={`navbar navbar-expand-lg fixed-top ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">Sky</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {user && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/usuarios" className="nav-link">Usuarios</Link>
              </li>
              <li className="nav-item">
                <Link to="/tareas" className="nav-link">Tareas</Link>
              </li>
              <li className="nav-item">
                <Link to="/eventos" className="nav-link">Eventos</Link>
              </li>
              <li className="nav-item d-flex align-items-center">
                <NotificationBell />
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                >
                  Cerrar sesión
                </button>
              </li>
              <li className="nav-item ms-2">
                <button
                  onClick={toggleDarkMode} // Este es el botón que llama a la función del contexto
                  className="btn btn-secondary"
                >
                  {darkMode ? 'Claro' : 'Oscuro'}
                </button>
              </li>
            </ul>
          )}

          {!user && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Registrarse</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
