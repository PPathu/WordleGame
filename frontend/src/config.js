const getApiUrl = () => {
  // First check if we have an explicit API URL from environment
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Otherwise, use environment-based defaults
  if (process.env.NODE_ENV === 'production') {
    return 'https://wordle-backend-lewg.onrender.com/api';
  }
  
  // Development fallback
  return 'http://localhost:5001/api';
};

export const API_URL = getApiUrl(); 
