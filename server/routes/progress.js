const express = require('express');
const { getDb } = require('../db/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Mark module as complete
router.post('/module/:moduleId', verifyToken, (req, res) => {
  const db = getDb();
  const module = db.prepare('SELECT id FROM modules WHERE id = ?').get(req.params.moduleId);
  if (!module) return res.status(404).json({ error: 'Module not found' });

  db.prepare(
    'INSERT OR IGNORE INTO module_progress (user_id, module_id) VALUES (?, ?)'
  ).run(req.user.id, req.params.moduleId);
  res.json({ success: true });
});

// Get my progress summary
router.get('/my', verifyToken, (req, res) => {
  const db = getDb();
  const completedModules = db.prepare(
    'SELECT module_id, completed_at FROM module_progress WHERE user_id = ?'
  ).all(req.user.id);

  const quizAttempts = db.prepare(
    `SELECT qa.*, q.title as quiz_title, q.pass_score
     FROM quiz_attempts qa
     JOIN quizzes q ON qa.quiz_id = q.id
     WHERE qa.user_id = ?
     ORDER BY qa.completed_at DESC`
  ).all(req.user.id);

  const totalModules = db.prepare('SELECT COUNT(*) as c FROM modules').get().c;
  const totalQuizzes = db.prepare('SELECT COUNT(*) as c FROM quizzes').get().c;

  const bestScores = {};
  quizAttempts.forEach(a => {
    if (!bestScores[a.quiz_id] || a.score > bestScores[a.quiz_id]) {
      bestScores[a.quiz_id] = a.score;
    }
  });
  const avgScore = Object.values(bestScores).length
    ? Math.round(Object.values(bestScores).reduce((s, v) => s + v, 0) / Object.values(bestScores).length)
    : null;

  res.json({
    completedModules,
    totalModules,
    totalQuizzes,
    quizAttempts,
    avgScore,
    quizzesAttempted: Object.keys(bestScores).length
  });
});

module.exports = router;
