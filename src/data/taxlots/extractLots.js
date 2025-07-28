const fs = require('fs');
const path = require('path');

// Path to your text file
const filePath = path.join(__dirname, 'Aug2025.txt');

// Read and preprocess file (join lines to handle breaks in the pattern)
const text = fs.readFileSync(filePath, 'utf8');

// Remove line breaks that split words (join lines that are not empty)
const joined = text.replace(/(\w)-\n(\w)/g, '$1$2').replace(/\n/g, ' ');

// Regex to match LOT or LT, then a number, BLK, number, SEC, number
const lotRegex =
  /\b(LT|LOT)[S]?\s*(\d+)[A-Z\-&]*\s*BLK\s*(\d+)[A-Z\-&]*\s*SEC\s*(\d+)[A-Z\-&]*\b/gi;

let match;
const results = [];

while ((match = lotRegex.exec(joined)) !== null) {
  results.push({
    lotType: match[1],
    lot: match[2],
    block: match[3],
    section: match[4],
    fullMatch: match[0],
  });
}

// Output results
console.log('lot,block,section');
results.forEach((r) => {
  console.log(`${r.lot},${r.block},${r.section}`);
});
