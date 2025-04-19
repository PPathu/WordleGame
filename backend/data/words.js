const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'words.csv');
const wordsData = fs.readFileSync(csvPath, 'utf8');

// Parse CSV (one word per line) and filter for only 5-letter words
const words = wordsData
  .split('\n')
  .map(word => word.trim())
  .filter(word => word !== '' && word.length === 5); 

console.log(`Loaded ${words.length} 5-letter words from CSV`);

module.exports = words; 
