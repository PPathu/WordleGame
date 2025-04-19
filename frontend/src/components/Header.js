import React from 'react';
import '../styles/Header.css';

const Header = ({ onNewGame }) => {
  return (
    <header className="header">
      <h1 className="title">Wordle</h1>
      <button className="new-game-btn" onClick={onNewGame}>
        New Game
      </button>
    </header>
  );
};

export default Header; 
