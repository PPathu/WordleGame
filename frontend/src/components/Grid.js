import React, { useState, useEffect } from 'react';
import '../styles/Grid.css';

const Grid = ({ guesses, currentGuess, maxGuesses }) => {
  // Create empty rows for remaining guesses
  const emptyRows = maxGuesses - guesses.length - (currentGuess ? 1 : 0);
  
  // State to track cells that should have the pop animation
  const [poppingCells, setPoppingCells] = useState([]);
  
  // Update popping cells when currentGuess changes
  useEffect(() => {
    if (currentGuess && currentGuess.length > 0) {
      // Only set the pop animation for the newest letter
      setPoppingCells([currentGuess.length - 1]);
      
      // Clear the animation after a short delay
      const timer = setTimeout(() => {
        setPoppingCells([]);
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [currentGuess]);
  
  return (
    <div className="grid">
      {/* Rows for previous guesses */}
      {guesses.map((guess, index) => {
        return (
          <div className="row" key={`guess-${index}`}>
            {guess.evaluation.map((evalItem, letterIndex) => (
              <div 
                className={`cell ${evalItem.status} ${guess.isCorrect ? 'spin' : ''}`} 
                key={`guess-${index}-${letterIndex}`}
                style={guess.isCorrect ? { animationDelay: `${letterIndex * 0.1}s` } : {}}
              >
                {evalItem.letter.toUpperCase()}
              </div>
            ))}
          </div>
        );
      })}
      
      {/* Row for current guess */}
      {currentGuess && (
        <div className="row">
          {Array.from({ length: 5 }).map((_, index) => (
            <div 
              className={`cell ${index < currentGuess.length ? 'filled' : 'empty'} ${poppingCells.includes(index) ? 'pop' : ''}`} 
              key={`current-${index}`}
            >
              {index < currentGuess.length ? currentGuess[index].toUpperCase() : ''}
            </div>
          ))}
        </div>
      )}
      
      {/* Empty rows for remaining guesses */}
      {Array.from({ length: emptyRows }).map((_, index) => (
        <div className="row" key={`empty-${index}`}>
          {Array.from({ length: 5 }).map((_, cellIndex) => (
            <div 
              className="cell empty" 
              key={`empty-${index}-${cellIndex}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid; 
