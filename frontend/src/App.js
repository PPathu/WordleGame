import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import GameOver from './components/GameOver';
import Toast from './components/Toast';
import { fetchNewGame, submitGuess, validateWord } from './services/api';

function App() {
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
      const validationResult = await validateWord(currentGuess);
      
      if (!validationResult.valid) {
        showToast('Not a valid word');
        setIsLoading(false);
        return;
      }
      
      // Submit the guess
      const result = await submitGuess(gameId, currentGuess);
      
      setGuesses([...guesses, { 
        word: currentGuess, 
        evaluation: result.evaluation 
      }]);
      
      setCurrentGuess('');
      
      if (result.finished) {
        setGameState({
          finished: true,
          won: result.won,
          targetWord: result.targetWord
        });
        setGameActive(false); // Game no longer active
        
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

  // Start a new game on component mount
  useEffect(() => {
    startNewGame();
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
      <Header onNewGame={startNewGame} disabled={isGameInProgress} />
      
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={clearToast} 
        duration={5000}
      />
      
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
          onNewGame={startNewGame}
        />
      ) : (
        <Keyboard 
          guesses={guesses} 
          onKeyPress={handleKeyPress} 
          disabled={isLoading}
        />
      )}
    </div>
  );
}

export default App;
