const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Word list - 5 letter words
const words = [
  'apple', 'beach', 'chair', 'dance', 'eagle', 
  'flame', 'globe', 'heart', 'image', 'juice',
  'kings', 'lemon', 'music', 'noble', 'ocean',
  'piano', 'queen', 'royal', 'sugar', 'tiger',
  'unity', 'video', 'water', 'xenon', 'yacht',
  'zebra', 'cloud', 'dream', 'faith', 'green',
  'house', 'ivory', 'jelly', 'knife', 'light',
  'metal', 'night', 'olive', 'paint', 'quick',
  'river', 'storm', 'table', 'umbrella', 'value',
  'world', 'young', 'zesty', 'brave', 'crisp'
];

// Store active games
const games = {};

// Generate a random word
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// Check if word is valid (in our word list)
function isValidWord(word) {
  return words.includes(word.toLowerCase());
}

// Evaluate a guess
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

// Routes
// Start new game
app.post('/api/game', (req, res) => {
  const gameId = Date.now().toString();
  const targetWord = getRandomWord();
  
  games[gameId] = {
    targetWord,
    guesses: [],
    finished: false,
    won: false
  };
  
  res.json({ gameId });
});

// Submit guess
app.post('/api/game/:id/guess', (req, res) => {
  const { id } = req.params;
  const { guess } = req.body;
  
  // Validate game exists
  if (!games[id]) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  const game = games[id];
  
  // Check if game is already over
  if (game.finished) {
    return res.status(400).json({ error: 'Game is already finished' });
  }
  
  // Validate guess
  if (!guess || guess.length !== 5) {
    return res.status(400).json({ error: 'Guess must be a 5-letter word' });
  }
  
  // Check if word is valid
  if (!isValidWord(guess)) {
    return res.status(400).json({ error: 'Not a valid word' });
  }
  
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
  
  // Send response
  res.json({
    evaluation,
    guessCount: game.guesses.length,
    finished: game.finished,
    won: game.won,
    targetWord: game.finished ? game.targetWord : undefined
  });
});

// Get game state
app.get('/api/game/:id', (req, res) => {
  const { id } = req.params;
  
  if (!games[id]) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  const game = games[id];
  
  res.json({
    guesses: game.guesses,
    guessCount: game.guesses.length,
    finished: game.finished,
    won: game.won,
    targetWord: game.finished ? game.targetWord : undefined
  });
});

// Check if word is valid
app.get('/api/validate/:word', (req, res) => {
  const { word } = req.params;
  res.json({ valid: isValidWord(word) });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
