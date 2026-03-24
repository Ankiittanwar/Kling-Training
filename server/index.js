require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./db/database');

const authRoutes = require('./routes/auth');
const modulesRoutes = require('./routes/modules');
const quizzesRoutes = require('./routes/quizzes');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Init DB (creates tables + seeds if empty)
initDb();

app.use('/api/auth', authRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Kling Training API running on http://localhost:${PORT}`);
});
