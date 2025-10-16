// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Registra el error en la consola o servicio de logging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">¡Oops! Algo salió mal</h4>
                <p>
                  Ha ocurrido un error inesperado en la aplicación. 
                  Por favor, recarga la página o contacta al administrador si el problema persiste.
                </p>
                <hr />
                <div className="mb-0">
                  <button 
                    className="btn btn-outline-danger me-2"
                    onClick={() => window.location.reload()}
                  >
                    Recargar página
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  >
                    Intentar de nuevo
                  </button>
                </div>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-3">
                    <summary>Detalles del error (solo en desarrollo)</summary>
                    <pre className="mt-2 p-2 bg-light border rounded">
                      {this.state.error && this.state.error.toString()}
                      <br />
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
