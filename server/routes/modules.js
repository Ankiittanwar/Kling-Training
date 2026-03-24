const express = require('express');
const { getDb } = require('../db/database');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all modules (with completion status for current user)
router.get('/', verifyToken, (req, res) => {
  const db = getDb();
  const modules = db.prepare('SELECT * FROM modules ORDER BY display_order').all();
  const progress = db.prepare(
    'SELECT module_id FROM module_progress WHERE user_id = ?'
  ).all(req.user.id).map(r => r.module_id);

  res.json(modules.map(m => ({ ...m, completed: progress.includes(m.id) })));
});

// Get single module
router.get('/:id', verifyToken, (req, res) => {
  const db = getDb();
  const module = db.prepare('SELECT * FROM modules WHERE id = ?').get(req.params.id);
  if (!module) return res.status(404).json({ error: 'Module not found' });

  const completed = !!db.prepare(
    'SELECT id FROM module_progress WHERE user_id = ? AND module_id = ?'
  ).get(req.user.id, module.id);

  res.json({ ...module, completed });
});

// Create module (admin only)
router.post('/', verifyToken, requireAdmin, (req, res) => {
  const { title, description, category, content, display_order } = req.body;
  if (!title || !category || !content) {
    return res.status(400).json({ error: 'title, category, and content are required' });
  }
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO modules (title, description, category, content, display_order) VALUES (?, ?, ?, ?, ?)'
  ).run(title, description || '', category, content, display_order || 0);
  res.status(201).json(db.prepare('SELECT * FROM modules WHERE id = ?').get(result.lastInsertRowid));
});

// Update module (admin only)
router.put('/:id', verifyToken, requireAdmin, (req, res) => {
  const { title, description, category, content, display_order } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM modules WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Module not found' });

  db.prepare(
    'UPDATE modules SET title=?, description=?, category=?, content=?, display_order=? WHERE id=?'
  ).run(title, description || '', category, content, display_order || 0, req.params.id);
  res.json(db.prepare('SELECT * FROM modules WHERE id = ?').get(req.params.id));
});

// Delete module (admin only)
router.delete('/:id', verifyToken, requireAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM modules WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Module not found' });
  db.prepare('DELETE FROM modules WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
