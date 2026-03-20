const express = require('express');
const cors = require('cors');
const path = require('path');
const { initSchema } = require('./db/schema');
const { seedData } = require('./db/seed');
const { setupAutoSave } = require('./db/connection');
const { backfillMastery } = require('./services/mastery-service');

async function start() {
  // Initialize database
  await initSchema();
  await seedData();

  // Backfill mastery records for previously learned items
  const today = new Date().toISOString().split('T')[0];
  await backfillMastery(today);

  setupAutoSave();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // API routes
  app.use('/api/daily', require('./routes/daily'));
  app.use('/api/quiz', require('./routes/quiz'));
  app.use('/api/grammar', require('./routes/grammar'));
  app.use('/api/stats', require('./routes/stats'));

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
