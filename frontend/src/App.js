import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import GameOver from './components/GameOver';
import Toast from './components/Toast';
import useApi from './hooks/useApi';

// Simple welcome component
const Welcome = ({ onStartGame }) => (
  <div className="welcome">
    <h2>Welcome to Wordle!</h2>
    <p>Guess the 5-letter word in six tries.</p>
    <button className="play-btn" onClick={onStartGame}>Start Game</button>
  </div>
);

function App() {
  const { fetchNewGame, submitGuess, validateWord, loading: apiLoading, error: apiError } = useApi();
  const [gameId, setGameId] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState({
    finished: false,
    won: false,
    targetWord: ''
  });
  const [toast, setToast] = useState({ message: '', type: 'error' });
  const [isLoading, setIsLoading] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [darkMode, setDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Apply dark mode class to the document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  // Display API errors as toast
  useEffect(() => {
    if (apiError) {
      showToast(apiError, 'error');
    }
  }, [apiError]);

  // Update loading state based on API loading
  useEffect(() => {
    setIsLoading(apiLoading);
  }, [apiLoading]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Check if game is in progress but not finished
  const isGameInProgress = gameActive && !gameState.finished;

  // Clear toast message
  const clearToast = () => setToast({ message: '', type: 'error' });

  // Show toast message
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  // Start a new game
  const startNewGame = async () => {
    // Don't allow starting a new game if one is in progress
    if (isGameInProgress) {
      showToast('Please finish the current game first', 'warning');
      return;
    }

    setIsLoading(true);
    clearToast();
    try {
      const data = await fetchNewGame();
      setGameId(data.gameId);
      setGuesses([]);
      setCurrentGuess('');
      setGameState({
        finished: false,
        won: false,
        targetWord: ''
      });
      setGameActive(true); // Set game as active
      showToast('New game started!', 'success');
    } catch (err) {
      showToast('Failed to start a new game');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit the current guess
  const handleSubmitGuess = async () => {
    if (currentGuess.length !== 5) {
      showToast('Word must be 5 letters');
      return;
    }

    setIsLoading(true);
    clearToast();
    
    try {
      // First validate the word
      console.log('Validating word:', currentGuess);
      const validationResult = await validateWord(currentGuess);
      console.log('Validation result:', validationResult);
      
      if (!validationResult || !validationResult.valid) {
        showToast('Not a valid word');
        setIsLoading(false);
        return;
      }
      
      // Submit the guess
      const result = await submitGuess(gameId, currentGuess);
      
      // Check if this guess is correct (all correct letters)
      const isCorrect = result.evaluation.every(evalItem => evalItem.status === 'correct');
      
      setGuesses([...guesses, { 
        word: currentGuess, 
        evaluation: result.evaluation,
        isCorrect: isCorrect  // Mark if this guess is correct
      }]);
      
      setCurrentGuess('');
      
      if (result.finished) {
        setGameState({
          finished: true,
          won: result.won,
          targetWord: result.targetWord
        });
        
        // Update streak count if won, reset if lost
        if (result.won) {
          setStreak(prev => prev + 1);
        } else {
          setStreak(0);
        }
        
        // Show appropriate toast for game result
        if (result.won) {
          showToast(`Congratulations! You guessed "${result.targetWord.toUpperCase()}" in ${result.guessCount} ${result.guessCount === 1 ? 'try' : 'tries'}!`, 'success');
        } else {
          showToast(`Game over! The word was "${result.targetWord.toUpperCase()}"`, 'warning');
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit guess');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard input
  const handleKeyPress = (key) => {
    if (gameState.finished) return;
    
    if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      clearToast();
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
      clearToast();
    }
  };

  // Remove the automatic game start on component mount
  useEffect(() => {
    // Don't start a game automatically
    showToast('Welcome to Wordle! Click "Play" to start a game', 'success');
  }, []);

  // Process physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameState.finished]);

  return (
    <div className="App">
      <Header 
        onNewGame={startNewGame} 
        disabled={isGameInProgress} 
        darkMode={darkMode}
        onToggleTheme={toggleDarkMode}
        gameActive={gameActive}
        streak={streak}
      />
      
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={clearToast} 
        duration={5000}
      />
      
      {!gameActive ? (
        <Welcome onStartGame={startNewGame} />
      ) : (
        <>
          <Grid 
            guesses={guesses} 
            currentGuess={currentGuess} 
            maxGuesses={6}
          />
          
          {gameState.finished ? (
            <GameOver 
              won={gameState.won} 
              targetWord={gameState.targetWord}
              guessCount={guesses.length}
              streak={streak}
              onNewGame={startNewGame}
            />
          ) : (
            <Keyboard 
              guesses={guesses} 
              onKeyPress={handleKeyPress} 
              disabled={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
