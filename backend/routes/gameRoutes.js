const express = require('express');
const gameController = require('../controllers/gameController');

const router = express.Router();

// Create a new game
router.post('/game', gameController.createGame);

// Submit a guess
router.post('/game/:id/guess', gameController.processGuess);

// Get game state
router.get('/game/:id', gameController.getGameState);

// Validate a word
router.get('/validate/:word', gameController.validateWord);

module.exports = router; 
