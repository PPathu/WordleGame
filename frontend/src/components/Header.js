import React from 'react';
import '../styles/Header.css';

const Header = ({ onNewGame, disabled = false, darkMode, onToggleTheme, gameActive = false, streak = 0 }) => {
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
      <div className="header-left">
        <button 
          className="theme-toggle" 
          onClick={onToggleTheme}
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div className="title-container">
        <h1 className="title">Wordle</h1>
        {gameActive && (
          <div className="streak-counter">
            <span className="streak-label">Streak:</span>
            <span className="streak-count">{streak}</span>
          </div>
        )}
      </div>
      
      <button 
        className={`new-game-btn ${disabled ? 'disabled' : ''}`} 
        onClick={handleNewGameClick}
        disabled={disabled}
        title={disabled ? "Finish the current game first" : "Start a new game"}
        aria-disabled={disabled}
      >
        {gameActive ? "Play Again" : "Play"}
      </button>
    </header>
  );
};

export default Header; 
