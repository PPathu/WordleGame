const gameService = require('../services/gameService');

/**
 * Controller for creating a new game
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createGame = (req, res) => {
  try {
    const result = gameService.createGame();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller for processing a guess
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const processGuess = (req, res) => {
  const { id } = req.params;
  const { guess } = req.body;
  
  try {
    const result = gameService.processGuess(id, guess);
    res.json(result);
  } catch (error) {
    if (error.message === 'Game not found') {
      return res.status(404).json({ error: error.message });
    }
    
    if (['Game is already finished', 'Guess must be a 5-letter word', 'Not a valid word'].includes(error.message)) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Controller for getting game state
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getGameState = (req, res) => {
  const { id } = req.params;
  
  try {
    const game = gameService.getGame(id);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json({
      guesses: game.guesses,
      guessCount: game.guesses.length,
      finished: game.finished,
      won: game.won,
      targetWord: game.finished ? game.targetWord : undefined
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Controller for validating a word
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const validateWord = (req, res) => {
  const { word } = req.params;
  
  try {
    const valid = gameService.isValidWord(word);
    res.json({ valid });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createGame,
  processGuess,
  getGameState,
  validateWord
}; 
