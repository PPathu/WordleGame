import { useState, useCallback } from 'react';

// Update API URL to use the local backend server
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wordle-backend-lewg.onrender.com/api'
  : 'http://localhost:5001/api';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNewGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Error starting new game:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, []);

  const validateWord = useCallback(async (word) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/validate/${word}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Validation response:', data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Error validating word:', err);
      setError(err.message);
      setLoading(false);
      return { valid: false };
    }
  }, []);

  const submitGuess = useCallback(async (gameId, guess) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/game/${gameId}/guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Error submitting guess:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, []);

  const getGameState = useCallback(async (gameId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/game/${gameId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Error getting game state:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    fetchNewGame,
    validateWord,
    submitGuess,
    getGameState
  };
};

export default useApi; 
