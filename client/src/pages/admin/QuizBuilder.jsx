import { useEffect, useState } from 'react';
import api from '../../api';

const EMPTY_QUIZ = { module_id: '', title: '', description: '', pass_score: 70 };
const EMPTY_Q = { question_text: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' };

export default function QuizBuilder() {
  const [quizzes, setQuizzes] = useState([]);
  const [modules, setModules] = useState([]);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizForm, setQuizForm] = useState(EMPTY_QUIZ);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [showQForm, setShowQForm] = useState(false);
  const [qForm, setQForm] = useState(EMPTY_Q);
  const [editingQ, setEditingQ] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteQuizId, setDeleteQuizId] = useState(null);
  const [deleteQId, setDeleteQId] = useState(null);

  function fetchQuizzes() {
    return api.get('/quizzes').then(r => setQuizzes(r.data));
  }

  useEffect(() => {
    Promise.all([fetchQuizzes(), api.get('/modules')]).then(([, m]) => setModules(m.data));
  }, []);

  function selectQuiz(q) {
    setSelected(q);
    api.get(`/quizzes/${q.id}/questions`).then(r => setQuestions(r.data));
    setShowQForm(false);
    setEditingQ(null);
  }

  async function saveQuiz(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...quizForm, module_id: quizForm.module_id || null, pass_score: parseInt(quizForm.pass_score) };
    try {
      if (editingQuiz) await api.put(`/quizzes/${editingQuiz}`, payload);
      else await api.post('/quizzes', payload);
      setShowQuizForm(false);
      await fetchQuizzes();
    } finally { setSaving(false); }
  }

  async function deleteQuiz(id) {
    await api.delete(`/quizzes/${id}`);
    setDeleteQuizId(null);
    if (selected?.id === id) { setSelected(null); setQuestions([]); }
    fetchQuizzes();
  }

  async function saveQuestion(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...qForm, options: qForm.options, correct_answer: parseInt(qForm.correct_answer) };
    try {
      if (editingQ) await api.put(`/quizzes/${selected.id}/questions/${editingQ}`, payload);
      else await api.post(`/quizzes/${selected.id}/questions`, payload);
      setShowQForm(false);
      setEditingQ(null);
      api.get(`/quizzes/${selected.id}/questions`).then(r => setQuestions(r.data));
    } finally { setSaving(false); }
  }

  async function deleteQuestion(qId) {
    await api.delete(`/quizzes/${selected.id}/questions/${qId}`);
    setDeleteQId(null);
    api.get(`/quizzes/${selected.id}/questions`).then(r => setQuestions(r.data));
  }

  function startEditQ(q) {
    setQForm({ question_text: q.question_text, options: [...q.options], correct_answer: q.correct_answer, explanation: q.explanation || '' });
    setEditingQ(q.id);
    setShowQForm(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Quiz Builder</h1>
        <button onClick={() => { setEditingQuiz(null); setQuizForm(EMPTY_QUIZ); setShowQuizForm(true); }} className="btn-primary">
          + New Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz list */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="font-bold text-navy mb-3">Quizzes ({quizzes.length})</h2>
            <div className="space-y-2">
              {quizzes.map(q => (
                <div
                  key={q.id}
                  onClick={() => selectQuiz(q)}
                  className={`rounded-lg p-3 cursor-pointer border transition-colors ${
                    selected?.id === q.id ? 'bg-navy text-white border-navy' : 'bg-gray-50 border-gray-200 hover:border-navy'
                  }`}
                >
                  <div className="font-medium text-sm truncate">{q.title}</div>
                  <div className={`text-xs mt-0.5 ${selected?.id === q.id ? 'text-white/60' : 'text-gray-400'}`}>
                    Pass: {q.pass_score}% · {q.attempts} attempts
                  </div>
                </div>
              ))}
              {quizzes.length === 0 && <p className="text-gray-400 text-sm">No quizzes yet.</p>}
            </div>
          </div>
        </div>

        {/* Questions panel */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="card text-center text-gray-400 py-16">Select a quiz to manage its questions</div>
          ) : (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-navy">{selected.title}</h2>
                  <p className="text-sm text-gray-400">{questions.length} questions · Pass: {selected.pass_score}%</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingQuiz(selected.id); setQuizForm({ title: selected.title, description: selected.description || '', pass_score: selected.pass_score, module_id: selected.module_id || '' }); setShowQuizForm(true); }} className="btn-outline text-sm py-1.5 px-3">Edit Quiz</button>
                  <button onClick={() => setDeleteQuizId(selected.id)} className="btn-danger text-sm py-1.5 px-3">Delete</button>
                  <button onClick={() => { setEditingQ(null); setQForm(EMPTY_Q); setShowQForm(true); }} className="btn-primary text-sm py-1.5 px-3">+ Question</button>
                </div>
              </div>

              {/* Question form */}
              {showQForm && (
                <form onSubmit={saveQuestion} className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                  <h3 className="font-semibold text-navy text-sm">{editingQ ? 'Edit Question' : 'New Question'}</h3>
                  <div>
                    <label className="label">Question *</label>
                    <textarea className="input text-sm" rows={2} value={qForm.question_text} onChange={e => setQForm(f => ({ ...f, question_text: e.target.value }))} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {qForm.options.map((opt, i) => (
                      <div key={i}>
                        <label className="label flex items-center gap-1">
                          <input type="radio" name="correct" checked={qForm.correct_answer === i} onChange={() => setQForm(f => ({ ...f, correct_answer: i }))} />
                          <span>Option {String.fromCharCode(65 + i)} {qForm.correct_answer === i ? '(correct)' : ''}</span>
                        </label>
                        <input className="input text-sm" value={opt} onChange={e => setQForm(f => ({ ...f, options: f.options.map((o, j) => j === i ? e.target.value : o) }))} required />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="label">Explanation (shown after answer)</label>
                    <input className="input text-sm" value={qForm.explanation} onChange={e => setQForm(f => ({ ...f, explanation: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Saving…' : 'Save'}</button>
                    <button type="button" onClick={() => setShowQForm(false)} className="btn-outline text-sm">Cancel</button>
                  </div>
                </form>
              )}

              {/* Questions list */}
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={q.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{i + 1}. {q.question_text}</p>
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          {q.options.map((opt, idx) => (
                            <div key={idx} className={`text-xs px-2 py-1 rounded ${idx === q.correct_answer ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-500'}`}>
                              {String.fromCharCode(65 + idx)}. {opt}
                            </div>
                          ))}
                        </div>
                        {q.explanation && <p className="text-xs text-blue-600 mt-1 italic">{q.explanation}</p>}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => startEditQ(q)} className="text-xs text-navy hover:underline">Edit</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => setDeleteQId(q.id)} className="text-xs text-red-500 hover:underline">Del</button>
                      </div>
                    </div>
                  </div>
                ))}
                {questions.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No questions yet. Add your first question.</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz form modal */}
      {showQuizForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="font-bold text-navy text-lg mb-4">{editingQuiz ? 'Edit Quiz' : 'New Quiz'}</h3>
            <form onSubmit={saveQuiz} className="space-y-3">
              <div>
                <label className="label">Title *</label>
                <input className="input" value={quizForm.title} onChange={e => setQuizForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Linked Module (optional)</label>
                <select className="input" value={quizForm.module_id} onChange={e => setQuizForm(f => ({ ...f, module_id: e.target.value }))}>
                  <option value="">— No linked module —</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Description</label>
                <input className="input" value={quizForm.description} onChange={e => setQuizForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="label">Pass Score (%)</label>
                <input type="number" min="1" max="100" className="input" value={quizForm.pass_score} onChange={e => setQuizForm(f => ({ ...f, pass_score: e.target.value }))} />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save'}</button>
                <button type="button" onClick={() => setShowQuizForm(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm dialogs */}
      {deleteQuizId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900">Delete Quiz?</h3>
            <p className="text-gray-500 text-sm mt-2">All questions will be permanently deleted.</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => deleteQuiz(deleteQuizId)} className="btn-danger flex-1">Delete</button>
              <button onClick={() => setDeleteQuizId(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deleteQId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900">Delete Question?</h3>
            <p className="text-gray-500 text-sm mt-2">This cannot be undone.</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => deleteQuestion(deleteQId)} className="btn-danger flex-1">Delete</button>
              <button onClick={() => setDeleteQId(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
