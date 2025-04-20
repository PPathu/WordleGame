import { API_URL } from '../config';

// Fetch error handler
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `Error: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

// Start a new game
export const fetchNewGame = async () => {
  const response = await fetch(`${API_URL}/game`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse(response);
};

// Submit a guess
export const submitGuess = async (gameId, guess) => {
  const response = await fetch(`${API_URL}/game/${gameId}/guess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ guess }),
  });
  
  return handleResponse(response);
};

// Get current game state
export const getGameState = async (gameId) => {
  const response = await fetch(`${API_URL}/game/${gameId}`);
  return handleResponse(response);
};

// Validate word
export const validateWord = async (word) => {
  const response = await fetch(`${API_URL}/validate/${word}`);
  return handleResponse(response);
}; 
