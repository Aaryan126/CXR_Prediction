import React, { useState } from 'react';

function ResultsDisplay({ results, uploadedImage, onReset }) {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [showAllPredictions, setShowAllPredictions] = useState(false);

  if (!results) return null;

  const { predictions, all_predictions, gradcam_images, original_image, threshold_used } = results;
  const diseaseNames = Object.keys(predictions);

  // Get threshold percentage
  const thresholdPercent = threshold_used ? (threshold_used * 100).toFixed(0) : '50';

  // Sort all predictions by probability (descending)
  const sortedAllPredictions = all_predictions
    ? Object.entries(all_predictions).sort((a, b) => b[1] - a[1])
    : [];

  console.log('Results:', results);
  console.log('All predictions:', all_predictions);
  console.log('Sorted predictions:', sortedAllPredictions);

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
        <div className="section-header">
          <h3 className="section-title">Detected Conditions</h3>
          <span className="threshold-badge">Threshold: ≥{thresholdPercent}%</span>
        </div>
        <p className="section-description">
          Showing diseases with confidence above {thresholdPercent}% threshold
        </p>
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

      {/* Debug Info - Remove this after testing */}
      {!all_predictions && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <strong>Debug:</strong> all_predictions is not available in the response.
          Make sure the backend is updated and returning the all_predictions field.
        </div>
      )}

      {/* All Predictions - Expandable */}
      {sortedAllPredictions.length > 0 ? (
        <div className="all-predictions-section">
          <button
            className="toggle-all-predictions-btn"
            onClick={() => setShowAllPredictions(!showAllPredictions)}
          >
            <span>{showAllPredictions ? 'Hide' : 'Show'} All Disease Probabilities ({sortedAllPredictions.length})</span>
            <svg
              className={`toggle-icon ${showAllPredictions ? 'rotated' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showAllPredictions && (
            <div className="all-predictions-grid">
              {sortedAllPredictions.map(([disease, probability], index) => (
                <div key={disease} className="all-prediction-item">
                  <div className="all-prediction-rank">{index + 1}</div>
                  <div className="all-prediction-info">
                    <div className="all-prediction-name">{disease}</div>
                    <div className="all-prediction-bar-container">
                      <div
                        className="all-prediction-bar"
                        style={{ width: `${probability * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="all-prediction-value">
                    {(probability * 100).toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

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
              <span className="legend-label">Low Attention</span>
              <div className="legend-gradient" />
              <span className="legend-label">High Attention</span>
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
