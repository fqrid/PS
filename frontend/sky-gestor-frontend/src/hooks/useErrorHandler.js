// src/hooks/useErrorHandler.js
import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error, customMessage = null) => {
    console.error('Error handled:', error);
    
    let errorMessage = customMessage;
    
    if (!errorMessage) {
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'Ha ocurrido un error inesperado';
      }
    }
    
    setError(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: error !== null
  };
};

export default useErrorHandler;
