import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import GameOver from './components/GameOver';
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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Start a new game
  const startNewGame = async () => {
    setIsLoading(true);
    setError('');
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
    } catch (err) {
      setError('Failed to start a new game');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit the current guess
  const handleSubmitGuess = async () => {
    if (currentGuess.length !== 5) {
      setError('Word must be 5 letters');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // First validate the word
      const validationResult = await validateWord(currentGuess);
      
      if (!validationResult.valid) {
        setError('Not a valid word');
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
      }
    } catch (err) {
      setError(err.message || 'Failed to submit guess');
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
      setError('');
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
      setError('');
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
      <Header onNewGame={startNewGame} />
      
      {error && <div className="error-message">{error}</div>}
      
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
