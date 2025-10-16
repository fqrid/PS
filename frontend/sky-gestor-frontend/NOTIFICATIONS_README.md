# Sistema de Notificaciones "In-App" - Frontend

## Descripción
Sistema de notificaciones que muestra eventos programados para las próximas 24 horas en tiempo real.

## Características Implementadas

### 🔔 Componente NotificationBell
- **Ubicación**: Navbar (solo visible para usuarios autenticados)
- **Icono**: Campana con badge de contador
- **Funcionalidad**: 
  - Muestra número de eventos próximos
  - Dropdown con lista de eventos
  - Actualización automática cada 5 minutos
  - Formato de tiempo relativo ("En 2h 30m")

### 📡 Servicio API (eventosService.js)
- **Endpoint**: `GET /api/eventos/proximas-24h`
- **Autenticación**: JWT Bearer Token
- **Manejo de errores**: Try/catch con mensajes de error
- **Headers**: Authorization automático desde localStorage

### 🎨 Estilos CSS
- **Archivo**: `src/styles/notifications.css`
- **Características**:
  - Animaciones suaves (slideDown)
  - Soporte para modo oscuro
  - Diseño responsive
  - Estados de carga y error
  - Badge animado con pulso

## Archivos Creados/Modificados

### Nuevos Archivos:
1. `src/services/eventosService.js` - Servicio API
2. `src/components/NotificationBell.jsx` - Componente principal
3. `src/styles/notifications.css` - Estilos CSS

### Archivos Modificados:
1. `src/components/Navbar.jsx` - Integración del componente
2. `src/index.js` - Importación de estilos

## Cómo Probar

### 1. Ejecutar el Frontend:
```bash
cd frontend/sky-gestor-frontend
npm start
```

### 2. Ejecutar el Backend:
```bash
cd backend/sky-gestor-backend
node server.js
```

### 3. Crear Eventos de Prueba:
```bash
# Login para obtener token
curl -X POST http://localhost:3001/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"test@test.com","contrasena":"123456"}'

# Crear evento para hoy (cambiar fecha según necesidad)
curl -X POST http://localhost:3001/api/eventos \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Reunión importante","descripcion":"Reunión de equipo","fecha":"2025-01-27 15:00:00"}'
```

### 4. Verificar Funcionamiento:
1. Inicia sesión en el frontend
2. Verifica que aparezca el ícono de campana 🔔 en el navbar
3. Haz clic en la campana para ver el dropdown
4. Verifica que se muestren los eventos próximos
5. El contador de badge debe mostrar el número de eventos

## Funcionalidades del Componente

### Estados Visuales:
- **Cargando**: Spinner con mensaje "Cargando eventos..."
- **Error**: Icono de advertencia con mensaje de error
- **Sin eventos**: Icono de calendario con mensaje "No hay eventos próximos"
- **Con eventos**: Lista de eventos con tiempo relativo

### Interacciones:
- **Click en campana**: Abre/cierra dropdown
- **Click fuera**: Cierra dropdown
- **Tecla Escape**: Cierra dropdown
- **Auto-actualización**: Cada 5 minutos

### Responsive:
- En móviles: Dropdown ocupa toda la pantalla
- En desktop: Dropdown posicionado a la derecha

## Dependencias
- React 19.1.0
- Bootstrap 5.3.6
- React Router DOM 7.6.0
- JWT Decode 4.0.0

## Notas Técnicas
- El componente solo se renderiza si el usuario está autenticado
- Usa emojis en lugar de Bootstrap Icons para mayor compatibilidad
- Manejo de errores robusto con try/catch
- Actualización automática con cleanup de intervalos
- Accesibilidad mejorada con ARIA labels y roles
