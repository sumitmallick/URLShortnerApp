import React, { useState } from 'react';
import './App.css';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const API_BASE_URL = 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortenedUrl('');
    setShortCode('');
    setCopied(false);
    setLoading(true);

    // Validate URL
    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      setLoading(false);
      return;
    }

    // Add https:// if no protocol specified
    let urlToShorten = originalUrl.trim();
    if (!urlToShorten.startsWith('http://') && !urlToShorten.startsWith('https://')) {
      urlToShorten = 'https://' + urlToShorten;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/v1/urls/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ original_url: urlToShorten }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      setShortCode(data.short_code);
      setShortenedUrl(`${API_BASE_URL}/v1/urls/${data.short_code}`);
    } catch (err) {
      setError('Failed to shorten URL. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setOriginalUrl('');
    setShortenedUrl('');
    setShortCode('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🔗 URL Shortener</h1>
          <p className="subtitle">Shorten your long URLs into easy-to-share links</p>
        </header>

        <div className="card">
          <form onSubmit={handleSubmit} className="url-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter your long URL here..."
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="url-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                className="shorten-btn"
                disabled={loading}
              >
                {loading ? 'Shortening...' : 'Shorten'}
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {shortenedUrl && (
            <div className="result-container">
              <h3>Your shortened URL:</h3>
              <div className="result-box">
                <a 
                  href={shortenedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="shortened-link"
                >
                  {shortenedUrl}
                </a>
                <button 
                  onClick={handleCopy} 
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="info-text">
                <p>Short code: <strong>{shortCode}</strong></p>
                <p className="original-url">Original: {originalUrl}</p>
              </div>
              <button onClick={handleReset} className="reset-btn">
                Shorten Another URL
              </button>
            </div>
          )}
        </div>

        <footer className="footer">
          <p>Built with React + FastAPI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;