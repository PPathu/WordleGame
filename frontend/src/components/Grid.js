import React from 'react';
import '../styles/Grid.css';

const Grid = ({ guesses, currentGuess, maxGuesses }) => {
  // Create empty rows for remaining guesses
  const emptyRows = maxGuesses - guesses.length - (currentGuess ? 1 : 0);
  
  return (
    <div className="grid">
      {/* Rows for previous guesses */}
      {guesses.map((guess, index) => (
        <div className="row" key={`guess-${index}`}>
          {guess.evaluation.map((evalItem, letterIndex) => (
            <div 
              className={`cell ${evalItem.status}`} 
              key={`guess-${index}-${letterIndex}`}
            >
              {evalItem.letter.toUpperCase()}
            </div>
          ))}
        </div>
      ))}
      
      {/* Row for current guess */}
      {currentGuess && (
        <div className="row">
          {Array.from({ length: 5 }).map((_, index) => (
            <div 
              className={`cell ${index < currentGuess.length ? 'filled' : 'empty'}`} 
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
