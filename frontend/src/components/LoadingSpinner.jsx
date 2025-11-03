import React from 'react';

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <div className="loading-text">
        <h3>Analyzing X-Ray Image</h3>
        <p>Generating predictions and visualizations...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
