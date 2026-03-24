import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function ModuleViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [marking, setMarking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/modules/${id}`), api.get('/quizzes')]).then(([mRes, qRes]) => {
      setModule(mRes.data);
      setQuiz(qRes.data.find(q => q.module_id === parseInt(id)));
    }).finally(() => setLoading(false));
  }, [id]);

  async function markComplete() {
    setMarking(true);
    try {
      await api.post(`/progress/module/${id}`);
      setModule(m => ({ ...m, completed: true }));
    } finally {
      setMarking(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!module) return <div className="text-center py-16 text-gray-400">Module not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-300 mb-6">
        <Link to="/" className="hover:text-[#2CC4BD] transition-colors">Learning Hub</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="text-gray-500">{module.title}</span>
      </div>

      {/* Module header */}
      <div className="bg-navy rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/3" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/3" />
        <div className="relative z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2CC4BD]/20 text-[#2CC4BD] border border-[#2CC4BD]/30 mb-3">
            {module.category}
          </span>
          <h1 className="text-xl font-bold text-white mb-1">{module.title}</h1>
          <p className="text-white/50 text-sm">{module.description}</p>
          {module.completed && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Completed
            </div>
          )}
        </div>
      </div>

      {/* Module content */}
      <div className="card mb-6">
        <div
          className="module-content"
          dangerouslySetInnerHTML={{ __html: module.content }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        {!module.completed ? (
          <button onClick={markComplete} disabled={marking} className="btn-primary">
            {marking ? 'Saving…' : '✓ Mark as Complete'}
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Module completed
          </div>
        )}
        {quiz && (
          <Link to={`/quiz/${quiz.id}`} className="btn-secondary">
            {quiz.best_score !== null ? `Retake Quiz (Best: ${quiz.best_score}%)` : 'Take Quiz →'}
          </Link>
        )}
        <button onClick={() => navigate(-1)} className="btn-ghost">
          ← Back
        </button>
      </div>
    </div>
  );
}
