import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.js';
import '../styles/estilosEventos.css';

function Usuarios() {
  const { user } = useAuth();
  const { darkMode } = useTheme(); // Todavía lo importamos por si lo usas en otros lugares (ej: el h2)
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Estados relacionados con la edición que ya no son necesarios
  // const [nombre, setNombre] = useState('');
  // const [correo, setCorreo] = useState('');
  // const [modoEditar, setModoEditar] = useState(false);
  // const [usuarioActual, setUsuarioActual] = useState(null);
  // const [errores, setErrores] = useState({});

  const fetchUsuarios = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('usuarioToken');
      const res = await fetch('http://localhost:3001/api/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
        setFetchError(null);
      } else {
        const errData = await res.json();
        setFetchError(errData.error || 'Error al cargar usuarios.');
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setFetchError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsuarios();
  }, [user, fetchUsuarios]);

  // Las funciones de validación, eliminación, edición, etc., ya no son necesarias
  // porque los botones han sido eliminados.
  // const validarFormulario = () => { ... };
  // const eliminarUsuario = async (id) => { ... };
  // const iniciarEdicion = (usuario) => { ... };
  // const cancelarEdicion = () => { ... };
  // const guardarCambios = async (e) => { ... };

  if (loading) return <div className="text-center mt-5">Cargando usuarios...</div>;

  if (fetchError) return <div className="alert alert-danger text-center mt-5">{fetchError}</div>;

  return (
    <div className="fondo-personalizado">
      {/* El container-main ya no usa dark-mode-container, solo estilosEvento.css debe manejarlo */}
      {/* Si el estilo gris y transparente está definido en .container-main en estilosEventos.css,
          entonces no necesitas ninguna clase condicional aquí para el fondo del contenedor principal. */}
      <div className="container-main">
        <div className="container mt-5 pt-5">
          {/* El título h2 sigue usando darkMode para el color del texto */}
          <h2 className={`mb-4 text-center ${darkMode ? 'text-white' : 'text-dark'}`}>Gestión de Usuarios</h2>

          {/* El modal de edición de usuario ha sido eliminado completamente */}
          {/* {modoEditar && ( ... )} */}

          {/* Contenedor para la tabla de usuarios - se mantiene el estilo pero el fondo será 'bg-light'
              o si quieres el gris transparente también aquí, podrías quitar el bg-light y que el CSS
              del container-main lo afecte, o crear otra clase. Por ahora lo dejo en bg-light para que tenga un fondo claro. */}
          

            {/* table-dark/table-light seguirá cambiando el color de la tabla */}
            <div className={`table-responsive ${darkMode ? 'table-dark' : 'table-light'}`}>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    {/* La columna de Acciones ha sido eliminada */}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.correo}</td>
                      {/* Los botones de Editar y Eliminar han sido eliminados */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                  </div>
      </div>
    </div>
  );
}

export default Usuarios;