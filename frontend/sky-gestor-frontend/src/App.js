import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes de las vistas
// ¡Asegúrate de que estas extensiones (.jsx o .js) coincidan con los nombres reales de tus archivos!
import Home from './views/Home.jsx';            
import Login from './views/Login.jsx';          
import Registro from './views/Registro.jsx';    
import Eventos from './views/Eventos.jsx';      
import Tareas from './views/Tareas.jsx';        
import EventoDetalles from './views/EventoDetalles.jsx'; 
import Usuarios from './views/Usuarios.jsx';     

// Componentes comunes
import Navbar from './components/Navbar.jsx';             
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import ErrorBoundary from './components/ErrorBoundary.jsx';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/:id" element={<EventoDetalles />} />
            <Route path="/tareas" element={<Tareas />} />
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;