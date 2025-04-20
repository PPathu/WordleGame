import React from 'react';
import '../styles/GameOver.css';

const GameOver = ({ won, targetWord, guessCount, streak, onNewGame }) => {
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
