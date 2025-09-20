import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

const CredsModal = ({ isOpen, onClose }) => {
  const [creds, setCreds] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved credentials when component mounts
  useEffect(() => {
    if (isOpen) {
      loadCredentials();
    }
  }, [isOpen]);

  const loadCredentials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/credentials`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setCreds(data[0].content || '');
        }
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
      setError('Failed to load credentials');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save on text change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (creds.trim()) {
        saveCredentials();
      }
    }, 1000); // Save after 1 second of no typing

    return () => clearTimeout(timeoutId);
  }, [creds]);

  const saveCredentials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/credentials/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: creds }),
      });

      if (!response.ok) {
        throw new Error('Failed to save credentials');
      }
      
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error saving credentials:', error);
      setError('Failed to save credentials');
    }
  };

  const handleTextChange = (e) => {
    setCreds(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="creds-modal">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {isLoading && (
        <div className="loading-indicator">
          Loading...
        </div>
      )}
      
      <textarea
        value={creds}
        onChange={handleTextChange}
        placeholder="Type your credentials here... (saves automatically)"
        className="creds-textarea"
        autoFocus
        disabled={isLoading}
      />
    </div>
  );
};

export default CredsModal;