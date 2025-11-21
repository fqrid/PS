// src/components/LoadingSpinner.jsx
import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Cargando...', 
  centered = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  const containerClass = centered 
    ? `d-flex justify-content-center align-items-center ${className}`
    : className;

  return (
    <div className={containerClass} aria-label={text}>
      <div className={`spinner-border ${sizeClasses[size]}`} aria-hidden="true">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && (
        <span className="ms-2">{text}</span>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string,
  centered: PropTypes.bool,
  className: PropTypes.string
};

export default LoadingSpinner;
