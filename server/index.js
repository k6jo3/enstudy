const express = require('express');
const cors = require('cors');
const path = require('path');
const { initSchema } = require('./db/schema');
const { seedData } = require('./db/seed');
const { setupAutoSave } = require('./db/connection');
const { backfillMastery } = require('./services/mastery-service');
const { run, queryScalar } = require('./db/helpers');
const roundService = require('./services/round-service');
const { cleanOldDialogues } = require('./services/daily-session');
const { getToday } = require('./utils/date');

async function start() {
  // Initialize database
  await initSchema();
  await seedData();

  // Backfill mastery records for previously learned items
  const today = getToday();
  await backfillMastery(today);

  // Backfill: mark all past sessions as completed (one-time migration)
  await run('UPDATE sessions SET completed = 1 WHERE session_date < ? AND completed = 0', [today]);

  // Clean old-format dialogues so they regenerate with example-based templates
  await cleanOldDialogues();

  // Ensure round 1 exists
  await roundService.getCurrentRound();

  setupAutoSave();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // API routes
  app.use('/api/daily', require('./routes/daily'));
  app.use('/api/quiz', require('./routes/quiz'));
  app.use('/api/grammar', require('./routes/grammar'));
  app.use('/api/stats', require('./routes/stats'));
  app.use('/api/rounds', require('./routes/rounds'));
  app.use('/api/reading', require('./routes/reading'));
  app.use('/api/playback', require('./routes/playback'));
  app.use('/api/games', require('./routes/games'));
  app.use('/api/graded-reading', require('./routes/graded-reading'));
  app.use('/api/tts', require('./routes/tts'));
  app.use('/api/roots', require('./routes/roots'));

  // Serve static files in production
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`enStudy server running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
