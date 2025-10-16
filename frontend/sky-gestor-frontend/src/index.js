import React from 'react';
import { ThemeProvider } from './context/ThemeContext.js'; 
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/estilosEventos.css'; 
import './styles/notifications.css';
import App from './App.js';
import { AuthProvider } from './context/AuthContext.js'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
<AuthProvider>
<ThemeProvider>
<App />
</ThemeProvider>
</AuthProvider>
</React.StrictMode>
);