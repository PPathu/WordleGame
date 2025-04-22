import React from 'react';
import '../styles/GameOver.css';

const GameOver = ({ won, targetWord, guessCount, streak, onNewGame, time}) => {

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-over">
      <h2 className="game-over-title">
        {won ? 'Congratulations!' : 'Game Over'}
      </h2>
      
      <p className="game-over-message">
        {won 
          ? `You guessed the word in ${guessCount} ${guessCount === 1 ? 'try' : 'tries'}!` 
          : 'Better luck next time!'}
      </p>
      
      <p className="target-word">
        The word was: <span className="word">{targetWord.toUpperCase()}</span>
      </p>
      <p className="timer-display">
        Time taken: <strong>{formatTime(time)}</strong>
      </p>
      
      {won && (
        <p className="streak-display">
          Current streak: <span className="streak-value">{streak}</span>
        </p>
      )}
      
      <button className="play-again-btn" onClick={onNewGame}>
        Play Again
      </button>
    </div>
  );
};

export default GameOver; 
