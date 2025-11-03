import React, { useState } from 'react';

function ResultsDisplay({ results, uploadedImage, onReset }) {
  const [selectedDisease, setSelectedDisease] = useState(null);

  if (!results) return null;

  const { predictions, gradcam_images, original_image } = results;
  const diseaseNames = Object.keys(predictions);

  // Select first disease by default
  const displayDisease = selectedDisease || diseaseNames[0];
  const displayGradCAM = gradcam_images[displayDisease];

  return (
    <div className="results-container">
      <div className="results-header">
        <h2 className="results-title">Analysis Results</h2>
        <button className="reset-button" onClick={onReset}>
          <svg
            className="reset-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          New Analysis
        </button>
      </div>

      {/* Predictions Summary */}
      <div className="predictions-summary">
        <h3 className="section-title">Detected Conditions</h3>
        <div className="predictions-grid">
          {diseaseNames.map((disease) => (
            <div
              key={disease}
              className={`prediction-card ${selectedDisease === disease ? 'selected' : ''}`}
              onClick={() => setSelectedDisease(disease)}
            >
              <div className="prediction-header">
                <span className="disease-name">{disease}</span>
                <span className="confidence-badge">
                  {(predictions[disease] * 100).toFixed(1)}%
                </span>
              </div>
              <div className="confidence-bar-container">
                <div
                  className="confidence-bar"
                  style={{ width: `${predictions[disease] * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Comparison */}
      <div className="image-comparison">
        <h3 className="section-title">
          Grad-CAM Visualization {displayDisease && `- ${displayDisease}`}
        </h3>
        <div className="images-grid">
          {/* Original Image */}
          <div className="image-container">
            <div className="image-label">Original X-Ray</div>
            <div className="image-wrapper">
              <img
                src={`data:image/png;base64,${original_image}`}
                alt="Original X-Ray"
                className="result-image"
              />
            </div>
          </div>

          {/* Grad-CAM Visualization */}
          <div className="image-container">
            <div className="image-label">
              Grad-CAM Heatmap
              <span className="confidence-text">
                Confidence: {(predictions[displayDisease] * 100).toFixed(1)}%
              </span>
            </div>
            <div className="image-wrapper">
              <img
                src={`data:image/png;base64,${displayGradCAM}`}
                alt={`Grad-CAM for ${displayDisease}`}
                className="result-image"
              />
            </div>
            <div className="heatmap-legend">
              <span className="legend-label">Low attention</span>
              <div className="legend-gradient" />
              <span className="legend-label">High attention</span>
            </div>
          </div>
        </div>

        {diseaseNames.length > 1 && (
          <div className="view-selector">
            <p className="selector-label">Select condition to view:</p>
            <div className="selector-buttons">
              {diseaseNames.map((disease) => (
                <button
                  key={disease}
                  className={`selector-button ${
                    displayDisease === disease ? 'active' : ''
                  }`}
                  onClick={() => setSelectedDisease(disease)}
                >
                  {disease}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Information Banner */}
      <div className="info-banner">
        <svg
          className="info-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="info-text">
          <strong>Note:</strong> This is an AI-assisted tool for educational purposes.
          Always consult with qualified medical professionals for proper diagnosis and treatment.
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;
