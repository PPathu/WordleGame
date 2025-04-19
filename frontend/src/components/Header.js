import React from 'react';
import '../styles/Header.css';

const Header = ({ onNewGame, disabled = false }) => {
  // Handler for the button click that respects the disabled state
  const handleNewGameClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onNewGame();
  };

  return (
    <header className="header">
      <h1 className="title">Wordle</h1>
      <button 
        className={`new-game-btn ${disabled ? 'disabled' : ''}`} 
        onClick={handleNewGameClick}
        disabled={disabled}
        title={disabled ? "Finish the current game first" : "Start a new game"}
        aria-disabled={disabled}
      >
        New Game
      </button>
    </header>
  );
};

export default Header; 
