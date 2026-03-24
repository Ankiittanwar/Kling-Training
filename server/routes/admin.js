const express = require('express');
const { getDb } = require('../db/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken, requireAdmin);

// Overview stats
router.get('/stats', (req, res) => {
  const db = getDb();
  const totalEmployees = db.prepare("SELECT COUNT(*) as c FROM users WHERE role='employee'").get().c;
  const totalModules = db.prepare('SELECT COUNT(*) as c FROM modules').get().c;
  const totalQuizzes = db.prepare('SELECT COUNT(*) as c FROM quizzes').get().c;
  const totalAttempts = db.prepare('SELECT COUNT(*) as c FROM quiz_attempts').get().c;

  const avgScoreRow = db.prepare('SELECT AVG(score) as avg FROM quiz_attempts').get();
  const avgScore = avgScoreRow.avg ? Math.round(avgScoreRow.avg) : null;

  const completionCount = db.prepare('SELECT COUNT(DISTINCT user_id) as c FROM module_progress').get().c;

  res.json({ totalEmployees, totalModules, totalQuizzes, totalAttempts, avgScore, completionCount });
});

// All employees with their progress summary
router.get('/employees', (req, res) => {
  const db = getDb();
  const employees = db.prepare(
    "SELECT id, name, email, created_at FROM users WHERE role='employee' ORDER BY name"
  ).all();

  const result = employees.map(emp => {
    const modulesCompleted = db.prepare(
      'SELECT COUNT(*) as c FROM module_progress WHERE user_id = ?'
    ).get(emp.id).c;

    const bestAttempts = db.prepare(
      'SELECT quiz_id, MAX(score) as best FROM quiz_attempts WHERE user_id = ? GROUP BY quiz_id'
    ).all(emp.id);

    const avgScore = bestAttempts.length
      ? Math.round(bestAttempts.reduce((s, a) => s + a.best, 0) / bestAttempts.length)
      : null;

    const lastActivity = db.prepare(
      `SELECT MAX(completed_at) as last FROM (
        SELECT completed_at FROM module_progress WHERE user_id = ?
        UNION ALL
        SELECT completed_at FROM quiz_attempts WHERE user_id = ?
      )`
    ).get(emp.id, emp.id).last;

    return { ...emp, modulesCompleted, quizzesAttempted: bestAttempts.length, avgScore, lastActivity };
  });

  res.json(result);
});

// Single employee detail
router.get('/employees/:id', (req, res) => {
  const db = getDb();
  const emp = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ? AND role='employee'").get(req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });

  const modulesCompleted = db.prepare(
    `SELECT mp.*, m.title as module_title, m.category
     FROM module_progress mp JOIN modules m ON mp.module_id = m.id
     WHERE mp.user_id = ? ORDER BY mp.completed_at DESC`
  ).all(req.params.id);

  const quizAttempts = db.prepare(
    `SELECT qa.*, q.title as quiz_title, q.pass_score
     FROM quiz_attempts qa JOIN quizzes q ON qa.quiz_id = q.id
     WHERE qa.user_id = ? ORDER BY qa.completed_at DESC`
  ).all(req.params.id);

  res.json({ ...emp, modulesCompleted, quizAttempts });
});

// Leaderboard
router.get('/leaderboard', (req, res) => {
  const db = getDb();
  const employees = db.prepare(
    "SELECT id, name FROM users WHERE role='employee'"
  ).all();

  const rows = employees.map(emp => {
    const bestAttempts = db.prepare(
      'SELECT quiz_id, MAX(score) as best FROM quiz_attempts WHERE user_id = ? GROUP BY quiz_id'
    ).all(emp.id);
    const avgScore = bestAttempts.length
      ? Math.round(bestAttempts.reduce((s, a) => s + a.best, 0) / bestAttempts.length)
      : null;
    const modulesCompleted = db.prepare(
      'SELECT COUNT(*) as c FROM module_progress WHERE user_id = ?'
    ).get(emp.id).c;
    return { ...emp, avgScore, quizzesAttempted: bestAttempts.length, modulesCompleted };
  });

  rows.sort((a, b) => {
    if (b.avgScore === null && a.avgScore === null) return 0;
    if (b.avgScore === null) return -1;
    if (a.avgScore === null) return 1;
    return b.avgScore - a.avgScore;
  });

  res.json(rows.map((r, i) => ({ ...r, rank: i + 1 })));
});

// Admin: create employee account
router.post('/employees', (req, res) => {
  const bcrypt = require('bcryptjs');
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run(name, email, hash, 'employee');
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(user);
});

// Admin: delete employee
router.delete('/employees/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM users WHERE id = ? AND role = ?').run(req.params.id, 'employee');
  res.json({ success: true });
});

module.exports = router;
