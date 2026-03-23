// Combined vocabulary: ~5000 words across all difficulty levels
const words1 = require('./words1');   // Basic (difficulty 1) - 500
const words2 = require('./words2');   // Intermediate (difficulty 2) - 500
const words3 = require('./words3');   // Advanced (difficulty 3) - 500
const words4a = require('./words4a'); // TOEIC: Office/HR/Marketing - 250
const words4b = require('./words4b'); // TOEIC: Finance/Contracts/Logistics - 250
const words5a = require('./words5a'); // TOEIC: Manufacturing/RealEstate/Tech - 250
const words5b = require('./words5b'); // TOEIC: Banking/Healthcare/Transport/Media - 250
const words6 = require('./words6');   // TOEIC: Meetings/Email/Operations - 243
const words7 = require('./words7');   // Legal/Compliance/Insurance - 300
const words8 = require('./words8');   // Academic/Daily Life - 300
const words9 = require('./words9');   // Travel/Hospitality/Service - 300
const words10 = require('./words10'); // Technology/IT - 300
const words11 = require('./words11'); // Travel & Shopping - 300
const words12 = require('./words12'); // Geography - 300
const words13 = require('./words13'); // Dates, Numbers & IT - 180
const words14 = require('./words14'); // Daily Life & Conversation - 300
const words15 = require('./words15'); // Travel, Shopping, Geography, Tech - 350
const words16 = require('./words16'); // Lifestyle, Career, Health, Entertainment - 350
const words17 = require('./words17'); // Transportation, Education, Society, Science - 350
const words18 = require('./words18'); // Core Vocabulary Expansion - 700

module.exports = [...words1, ...words2, ...words3, ...words4a, ...words4b, ...words5a, ...words5b, ...words6, ...words7, ...words8, ...words9, ...words10, ...words11, ...words12, ...words13, ...words14, ...words15, ...words16, ...words17, ...words18];
