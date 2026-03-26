import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

function StatCard({ label, value, accent = '#0F1923', to, icon }) {
  const inner = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-1">
      {icon && <div className="text-xl mb-1">{icon}</div>}
      <div className="text-3xl font-bold" style={{ color: accent }}>{value ?? '—'}</div>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/employees')]).then(([s, e]) => {
      setStats(s.data);
      setEmployees(e.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Training portal overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Employees" value={stats.totalEmployees} to="/admin/employees" />
        <StatCard label="Modules" value={stats.totalModules} to="/admin/modules" accent="#2CC4BD" />
        <StatCard label="Quizzes" value={stats.totalQuizzes} to="/admin/quizzes" accent="#8b5cf6" />
        <StatCard label="Attempts" value={stats.totalAttempts} accent="#f59e0b" />
        <StatCard label="Avg Score" value={stats.avgScore ? `${stats.avgScore}%` : null} accent={stats.avgScore >= 70 ? '#10b981' : '#ef4444'} />
        <StatCard label="Learners" value={stats.completionCount} accent="#6366f1" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/modules" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="w-9 h-9 rounded-xl bg-navy/5 flex items-center justify-center mb-3 group-hover:bg-navy/10 transition-colors">
            <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
          </div>
          <h3 className="font-bold text-navy text-sm">Content Manager</h3>
          <p className="text-xs text-gray-400 mt-1">Add or edit learning modules</p>
        </Link>
        <Link to="/admin/quizzes" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="w-9 h-9 rounded-xl bg-[#2CC4BD]/10 flex items-center justify-center mb-3 group-hover:bg-[#2CC4BD]/20 transition-colors">
            <svg className="w-5 h-5 text-[#1EA39D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
          </div>
          <h3 className="font-bold text-navy text-sm">Quiz Builder</h3>
          <p className="text-xs text-gray-400 mt-1">Create and manage quiz questions</p>
        </Link>
        <Link to="/admin/leaderboard" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>
          </div>
          <h3 className="font-bold text-navy text-sm">Leaderboard</h3>
          <p className="text-xs text-gray-400 mt-1">See top performing employees</p>
        </Link>
      </div>

      {/* Recent employees */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-navy text-base">Recent Employees</h2>
          <Link to="/admin/employees" className="text-xs font-semibold text-[#2CC4BD] hover:text-[#1EA39D] transition-colors">View all →</Link>
        </div>
        {employees.length === 0 ? (
          <p className="text-gray-300 text-sm">No employees registered yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                <th className="text-center py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Modules</th>
                <th className="text-center py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Avg Score</th>
                <th className="text-right py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-medium text-gray-700">{e.name}</td>
                  <td className="py-3 text-center font-bold text-navy">{e.modulesCompleted}</td>
                  <td className="py-3 text-center">
                    {e.avgScore !== null ? (
                      <span className={e.avgScore >= 70 ? 'badge-pass' : 'badge-fail'}>{e.avgScore}%</span>
                    ) : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="py-3 text-right text-gray-300 text-xs">{new Date(e.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
