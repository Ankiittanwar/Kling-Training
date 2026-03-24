import { useEffect, useState } from 'react';
import api from '../../api';

const CATEGORIES = ['Company', 'Brands', 'Products', 'Operations', 'Customer Service'];
const EMPTY = { title: '', description: '', category: 'Company', content: '', display_order: 0 };

export default function ModuleEditor() {
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  function fetchModules() {
    api.get('/modules').then(r => setModules(r.data)).finally(() => setLoading(false));
  }

  useEffect(() => { fetchModules(); }, []);

  function startEdit(m) {
    setEditing(m.id);
    setForm({ title: m.title, description: m.description || '', category: m.category, content: m.content, display_order: m.display_order });
    setShowForm(true);
  }

  function startNew() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/modules/${editing}`, form);
      } else {
        await api.post('/modules', form);
      }
      setShowForm(false);
      fetchModules();
    } finally {
      setSaving(false);
    }
  }

  async function deleteModule(id) {
    await api.delete(`/modules/${id}`);
    setDeleteId(null);
    fetchModules();
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Module Editor</h1>
          <p className="text-gray-500 text-sm">{modules.length} modules</p>
        </div>
        <button onClick={startNew} className="btn-primary">+ New Module</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="font-bold text-navy mb-4">{editing ? 'Edit Module' : 'New Module'}</h2>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Title *</label>
                <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Category *</label>
                <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input type="number" className="input" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <label className="label">Content (HTML supported) *</label>
              <textarea
                className="input font-mono text-xs"
                rows={12}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save Module'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Module list */}
      <div className="space-y-3">
        {modules.map(m => (
          <div key={m.id} className="card flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-navy truncate">{m.title}</span>
                <span className="badge-category">{m.category}</span>
              </div>
              <p className="text-sm text-gray-400 mt-0.5 truncate">{m.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(m)} className="btn-outline text-sm py-1.5 px-3">Edit</button>
              <button onClick={() => setDeleteId(m.id)} className="btn-danger text-sm py-1.5 px-3">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 text-lg">Delete Module?</h3>
            <p className="text-gray-500 text-sm mt-2">This will also delete all associated quizzes and questions. This cannot be undone.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => deleteModule(deleteId)} className="btn-danger flex-1">Delete</button>
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
