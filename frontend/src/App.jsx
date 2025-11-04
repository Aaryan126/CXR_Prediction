import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleImageUpload = async (file) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append('file', file);

      // Store uploaded image preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      // Call API
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process image');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setUploadedImage(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="title">Chest X-Ray Disease Prediction</h1>
          <p className="subtitle">
            Upload a chest X-ray image to predict potential diseases with AI-powered visualization
          </p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {/* Upload Section */}
          {!results && (
            <section className="upload-section">
              <ImageUpload onImageUpload={handleImageUpload} disabled={loading} />
            </section>
          )}

          {/* Loading State */}
          {loading && (
            <section className="loading-section">
              <LoadingSpinner />
            </section>
          )}

          {/* Error Message */}
          {error && (
            <section className="error-section">
              <ErrorMessage message={error} onRetry={handleReset} />
            </section>
          )}

          {/* Results Section */}
          {results && !loading && (
            <section className="results-section">
              <ResultsDisplay
                results={results}
                uploadedImage={uploadedImage}
                onReset={handleReset}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
