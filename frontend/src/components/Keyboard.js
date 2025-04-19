import React from 'react';
import '../styles/Keyboard.css';

const Keyboard = ({ guesses, onKeyPress, disabled }) => {
  // Define keyboard layout
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  // Get keyboard key status based on previous guesses
  const getKeyStatus = (key) => {
    // Special keys don't have status
    if (key === 'ENTER' || key === 'BACKSPACE') return '';
    
    let status = '';
    
    // Check all previous guesses for this letter
    for (const guess of guesses) {
      for (const evalItem of guess.evaluation) {
        if (evalItem.letter.toUpperCase() === key) {
          // If it's correct in any guess, that overrides any other status
          if (evalItem.status === 'correct') return 'correct';
          
          // Otherwise, set to present unless we later find a correct match
          if (evalItem.status === 'present') status = 'present';
          
          // Only set to absent if we haven't found a better status yet
          if (evalItem.status === 'absent' && status === '') status = 'absent';
        }
      }
    }
    
    return status;
  };

  return (
    <div className="keyboard">
      {keyboardRows.map((row, rowIndex) => (
        <div className="keyboard-row" key={`row-${rowIndex}`}>
          {row.map((key) => {
            const status = getKeyStatus(key);
            const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE';
            
            return (
              <button
                key={key}
                className={`key ${status} ${isSpecialKey ? 'special-key' : ''}`}
                onClick={() => onKeyPress(key)}
                disabled={disabled}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 
