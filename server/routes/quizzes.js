const express = require('express');
const { getDb } = require('../db/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all quizzes
router.get('/', verifyToken, (req, res) => {
  const db = getDb();
  const quizzes = db.prepare('SELECT * FROM quizzes ORDER BY id').all();
  const attempts = db.prepare(
    'SELECT quiz_id, MAX(score) as best_score, COUNT(*) as attempts FROM quiz_attempts WHERE user_id = ? GROUP BY quiz_id'
  ).all(req.user.id);
  const attemptMap = {};
  attempts.forEach(a => { attemptMap[a.quiz_id] = a; });

  res.json(quizzes.map(q => ({
    ...q,
    best_score: attemptMap[q.id]?.best_score ?? null,
    attempts: attemptMap[q.id]?.attempts ?? 0
  })));
});

// Get single quiz with questions
router.get('/:id', verifyToken, (req, res) => {
  const db = getDb();
  const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const questions = db.prepare(
    'SELECT * FROM questions WHERE quiz_id = ? ORDER BY display_order'
  ).all(req.params.id).map(q => ({
    ...q,
    options: JSON.parse(q.options)
  }));

  res.json({ ...quiz, questions });
});

// Submit quiz attempt
router.post('/:id/attempt', verifyToken, (req, res) => {
  const { answers } = req.body; // { questionId: selectedIndex, ... }
  if (!answers) return res.status(400).json({ error: 'answers required' });

  const db = getDb();
  const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const questions = db.prepare('SELECT * FROM questions WHERE quiz_id = ?').all(req.params.id);
  let correct = 0;
  const results = questions.map(q => {
    const selected = answers[q.id];
    const isCorrect = selected === q.correct_answer;
    if (isCorrect) correct++;
    return {
      question_id: q.id,
      question_text: q.question_text,
      options: JSON.parse(q.options),
      selected,
      correct_answer: q.correct_answer,
      is_correct: isCorrect,
      explanation: q.explanation
    };
  });

  const total = questions.length;
  const score = Math.round((correct / total) * 100);
  const passed = score >= quiz.pass_score;

  const result = db.prepare(
    'INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, passed) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.id, quiz.id, score, total, passed ? 1 : 0);

  res.json({ attempt_id: result.lastInsertRowid, score, total, correct, passed, results });
});

// Admin: Create quiz
router.post('/', verifyToken, requireAdmin, (req, res) => {
  const { module_id, title, description, pass_score } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO quizzes (module_id, title, description, pass_score) VALUES (?, ?, ?, ?)'
  ).run(module_id || null, title, description || '', pass_score || 70);
  res.status(201).json(db.prepare('SELECT * FROM quizzes WHERE id = ?').get(result.lastInsertRowid));
});

// Admin: Update quiz
router.put('/:id', verifyToken, requireAdmin, (req, res) => {
  const { module_id, title, description, pass_score } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM quizzes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Quiz not found' });
  db.prepare(
    'UPDATE quizzes SET module_id=?, title=?, description=?, pass_score=? WHERE id=?'
  ).run(module_id || null, title, description || '', pass_score || 70, req.params.id);
  res.json(db.prepare('SELECT * FROM quizzes WHERE id = ?').get(req.params.id));
});

// Admin: Delete quiz
router.delete('/:id', verifyToken, requireAdmin, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM quizzes WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// Admin: Get questions for a quiz
router.get('/:id/questions', verifyToken, requireAdmin, (req, res) => {
  const db = getDb();
  const questions = db.prepare(
    'SELECT * FROM questions WHERE quiz_id = ? ORDER BY display_order'
  ).all(req.params.id).map(q => ({ ...q, options: JSON.parse(q.options) }));
  res.json(questions);
});

// Admin: Add question
router.post('/:id/questions', verifyToken, requireAdmin, (req, res) => {
  const { question_text, options, correct_answer, explanation } = req.body;
  if (!question_text || !options || correct_answer === undefined) {
    return res.status(400).json({ error: 'question_text, options, correct_answer are required' });
  }
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as c FROM questions WHERE quiz_id = ?').get(req.params.id);
  const result = db.prepare(
    'INSERT INTO questions (quiz_id, question_text, options, correct_answer, explanation, display_order) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.params.id, question_text, JSON.stringify(options), correct_answer, explanation || '', count.c);
  const q = db.prepare('SELECT * FROM questions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...q, options: JSON.parse(q.options) });
});

// Admin: Update question
router.put('/:quizId/questions/:qId', verifyToken, requireAdmin, (req, res) => {
  const { question_text, options, correct_answer, explanation } = req.body;
  const db = getDb();
  db.prepare(
    'UPDATE questions SET question_text=?, options=?, correct_answer=?, explanation=? WHERE id=? AND quiz_id=?'
  ).run(question_text, JSON.stringify(options), correct_answer, explanation || '', req.params.qId, req.params.quizId);
  const q = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.qId);
  res.json({ ...q, options: JSON.parse(q.options) });
});

// Admin: Delete question
router.delete('/:quizId/questions/:qId', verifyToken, requireAdmin, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM questions WHERE id = ? AND quiz_id = ?').run(req.params.qId, req.params.quizId);
  res.json({ success: true });
});

module.exports = router;
