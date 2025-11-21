//modificacion

// src/views/Home.jsx
import React from 'react';
import '../styles/estilosEventos.css';

function Home() {
  return (
    <div className="fondo-personalizado" style={{ backgroundImage: 'url("/imagen/IMG_5994.JPEG")' }}>
      <div className="container mt-5 pt-5">
        <h2 className="text-center mb-4">Bienvenido a Sky – Gestor de Horarios</h2>
        <p className="lead text-center">
          Desde aquí puedes gestionar tus tareas, eventos y usuarios.
        </p>
      </div>
    </div>
  );
}

export default Home;

