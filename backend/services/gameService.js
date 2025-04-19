const words = require('../data/words');

// Store active games
const games = {};

/**
 * Generate a random word from the word list
 * @returns {string} A random 5-letter word
 */
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Check if a word is valid (in our word list)
 * @param {string} word - The word to validate
 * @returns {boolean} True if the word is valid
 */
function isValidWord(word) {
  return words.includes(word.toLowerCase());
}

/**
 * Evaluate a guess against the target word
 * @param {string} guess - The player's guess
 * @param {string} target - The target word
 * @returns {Array} Array of letter evaluations with status
 */
function evaluateGuess(guess, target) {
  const result = [];
  const guessCopy = guess.toLowerCase().split('');
  const targetCopy = target.toLowerCase().split('');
  
  // First pass: Check for correct positions (green)
  for (let i = 0; i < guessCopy.length; i++) {
    if (guessCopy[i] === targetCopy[i]) {
      result[i] = { letter: guessCopy[i], status: 'correct' }; // Green
      guessCopy[i] = targetCopy[i] = null; // Mark as used
    }
  }
  
  // Second pass: Check for letters in wrong positions (yellow) or not in word (gray)
  for (let i = 0; i < guessCopy.length; i++) {
    if (guessCopy[i] === null) continue; // Skip already matched
    
    const letterIndex = targetCopy.indexOf(guessCopy[i]);
    if (letterIndex !== -1) {
      result[i] = { letter: guessCopy[i], status: 'present' }; // Yellow
      targetCopy[letterIndex] = null; // Mark as used
    } else {
      result[i] = { letter: guessCopy[i], status: 'absent' }; // Gray
    }
  }
  
  return result;
}

/**
 * Create a new game
 * @returns {Object} Game info with gameId
 */
function createGame() {
  const gameId = Date.now().toString();
  const targetWord = getRandomWord();
  
  // Log the target word to the console for debugging
  console.log(`New game created with ID: ${gameId}, target word: ${targetWord}`);
  
  games[gameId] = {
    targetWord,
    guesses: [],
    finished: false,
    won: false
  };
  
  return { gameId };
}

/**
 * Get an existing game by ID
 * @param {string} gameId - The game ID
 * @returns {Object|null} The game object or null if not found
 */
function getGame(gameId) {
  return games[gameId] || null;
}

/**
 * Process a guess for a specific game
 * @param {string} gameId - The game ID
 * @param {string} guess - The player's guess
 * @returns {Object} Result of the guess
 */
function processGuess(gameId, guess) {
  const game = games[gameId];
  
  if (!game) {
    throw new Error('Game not found');
  }
  
  if (game.finished) {
    throw new Error('Game is already finished');
  }
  
  if (!guess || guess.length !== 5) {
    throw new Error('Guess must be a 5-letter word');
  }
  
  if (!isValidWord(guess)) {
    throw new Error('Not a valid word');
  }
  
  // Log the guess and target word
  console.log(`Game ${gameId}: Guess "${guess}" | Target word: "${game.targetWord}"`);
  
  // Evaluate guess
  const evaluation = evaluateGuess(guess, game.targetWord);
  
  // Update game state
  game.guesses.push({ word: guess, evaluation });
  
  // Check win condition
  const isCorrect = guess.toLowerCase() === game.targetWord.toLowerCase();
  
  if (isCorrect || game.guesses.length >= 6) {
    game.finished = true;
    game.won = isCorrect;
  }
  
  // Return response
  return {
    evaluation,
    guessCount: game.guesses.length,
    finished: game.finished,
    won: game.won,
    targetWord: game.finished ? game.targetWord : undefined
  };
}

module.exports = {
  getRandomWord,
  isValidWord,
  evaluateGuess,
  createGame,
  getGame,
  processGuess
}; 
