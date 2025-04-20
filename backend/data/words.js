const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'words.csv');
console.log(`Loading words from: ${csvPath}`);

try {
  const wordsData = fs.readFileSync(csvPath, 'utf8');
  
  // Parse CSV (one word per line) and filter for only 5-letter words
  const words = wordsData
    .split('\n')
    .map(word => word.trim().toLowerCase()) // Normalize to lowercase
    .filter(word => word !== '' && word.length === 5); 
  
  console.log(`Loaded ${words.length} 5-letter words from CSV`);
  
  if (words.length > 0) {
    console.log(`Sample words: ${words.slice(0, 10).join(', ')}`);
  } else {
    console.error('No words loaded! Check the CSV file format.');
  }
  
  module.exports = words;
} catch (error) {
  console.error('Error loading words from CSV:', error);
  // Fallback to a small set of words if CSV loading fails
  const fallbackWords = ['apple', 'beach', 'chair', 'dance', 'eagle', 'faith', 'grape', 'house', 'image', 'juice'];
  console.log(`Falling back to ${fallbackWords.length} default words`);
  module.exports = fallbackWords;
} 
