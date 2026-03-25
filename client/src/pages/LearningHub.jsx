import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const CATEGORIES = ['All', 'Company', 'Brands', 'Products', 'Operations', 'Customer Service'];
const CATEGORY_COLORS = {
  Company:           'bg-sky-50 text-sky-700 border border-sky-100',
  Brands:            'bg-violet-50 text-violet-700 border border-violet-100',
  Products:          'bg-amber-50 text-amber-700 border border-amber-100',
  Operations:        'bg-emerald-50 text-emerald-700 border border-emerald-100',
  'Customer Service':'bg-rose-50 text-rose-600 border border-rose-100',
};

export default function LearningHub() {
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  function fetchData() {
    setLoading(true);
    setLoadError('');
    Promise.all([api.get('/modules'), api.get('/quizzes')])
      .then(([mRes, qRes]) => {
        setModules(mRes.data);
        setQuizzes(qRes.data);
      })
      .catch(() => setLoadError('Server is starting up — this can take 30–60 seconds on first load.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData(); }, []);

  const filtered = filter === 'All' ? modules : modules.filter(m => m.category === filter);

  function getModuleQuiz(moduleId) {
    return quizzes.find(q => q.module_id === moduleId);
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-6 h-6 border-2 border-[#2CC4BD] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Loading your modules…</p>
    </div>
  );

  if (loadError) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">⏳</div>
      <h2 className="text-lg font-bold text-navy mb-2">Server is waking up</h2>
      <p className="text-sm text-gray-500 mb-6">{loadError}</p>
      <button onClick={fetchData} className="btn-primary">
        Try Again
      </button>
    </div>
  );

  const completed = modules.filter(m => m.completed).length;
  const pct = modules.length ? Math.round((completed / modules.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-6 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-navy tracking-tight">Learning Hub</h1>
          <p className="text-gray-400 text-sm mt-1">{completed} of {modules.length} modules completed</p>
          <div className="mt-3 bg-gray-100 rounded-full h-1.5 w-64 max-w-full">
            <div
              className="bg-gold h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 px-5 py-3 shadow-sm">
          <div className="text-2xl font-bold text-[#2CC4BD]">{pct}%</div>
          <div className="text-xs text-gray-400 leading-tight">Overall<br/>Progress</div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-7">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
              filter === cat
                ? 'bg-navy text-white shadow-sm'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-navy/30 hover:text-navy'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Module grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-300 text-sm">No modules in this category.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(module => {
            const quiz = getModuleQuiz(module.id);
            return (
              <div
                key={module.id}
                className="bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Card top accent */}
                <div className={`h-1 w-full ${module.completed ? 'bg-emerald-400' : 'bg-[#2CC4BD]/40'}`} />

                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${CATEGORY_COLORS[module.category] || 'bg-gray-100 text-gray-600'}`}>
                      {module.category}
                    </span>
                    {module.completed && (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Done
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-navy text-base leading-snug">{module.title}</h3>
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{module.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/modules/${module.id}`}
                      className="btn-secondary text-xs flex-1 text-center py-2"
                    >
                      {module.completed ? 'Review' : 'Learn'}
                    </Link>
                    {quiz && (
                      <Link
                        to={`/quiz/${quiz.id}`}
                        className={`text-xs flex-1 text-center rounded-lg px-3 py-2 font-semibold transition-all duration-150 ${
                          quiz.best_score !== null
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
                            : 'border border-gray-200 text-gray-600 hover:border-navy/30 hover:text-navy'
                        }`}
                      >
                        {quiz.best_score !== null ? `${quiz.best_score}% — Retake` : 'Take Quiz'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
