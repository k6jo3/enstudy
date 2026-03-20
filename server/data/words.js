// Combined vocabulary: ~2500 words across all difficulty levels
const words1 = require('./words1');   // Basic (difficulty 1) - 500
const words2 = require('./words2');   // Intermediate (difficulty 2) - 500
const words3 = require('./words3');   // Advanced (difficulty 3) - 500
const words4a = require('./words4a'); // TOEIC: Office/HR/Marketing - 250
const words4b = require('./words4b'); // TOEIC: Finance/Contracts/Logistics - 250
const words5a = require('./words5a'); // TOEIC: Manufacturing/RealEstate/Tech - 250
const words5b = require('./words5b'); // TOEIC: Banking/Healthcare/Transport/Media - 250

module.exports = [...words1, ...words2, ...words3, ...words4a, ...words4b, ...words5a, ...words5b];
