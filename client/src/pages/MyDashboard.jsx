import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function StatCard({ label, value, sub, accent = '#2CC4BD' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
      <div className="text-3xl font-bold" style={{ color: accent }}>{value ?? '—'}</div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-xs text-gray-300 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function MyDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  function handlePw(e) {
    setPwForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setPwError('');
    setPwSuccess('');
  }

  async function submitPw(e) {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    setPwLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setPwLoading(false);
    }
  }

  useEffect(() => {
    api.get('/progress/my').then(res => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const { completedModules, totalModules, totalQuizzes, quizAttempts, avgScore, quizzesAttempted } = data;
  const modPct = totalModules ? Math.round((completedModules.length / totalModules) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy tracking-tight">My Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Modules Done" value={`${completedModules.length}/${totalModules}`} accent="#0F1923" />
        <StatCard label="Quizzes Taken" value={`${quizzesAttempted}/${totalQuizzes}`} accent="#2CC4BD" />
        <StatCard
          label="Avg Score"
          value={avgScore !== null ? `${avgScore}%` : null}
          accent={avgScore >= 70 ? '#10b981' : '#ef4444'}
        />
        <StatCard label="Total Attempts" value={quizAttempts.length} accent="#8b5cf6" />
      </div>

      {/* Module progress */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy text-base">Module Progress</h2>
          <span className="text-xs font-semibold text-gray-400">{modPct}% complete</span>
        </div>
        <div className="bg-gray-100 rounded-full h-1.5 mb-5">
          <div
            className="bg-gold h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${modPct}%` }}
          />
        </div>
        {completedModules.length > 0 ? (
          <div className="space-y-1.5">
            {completedModules.map(mp => (
              <div key={mp.module_id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span className="font-medium text-gray-700 text-sm">{mp.module_title}</span>
                  <span className="badge-category hidden sm:inline-flex">{mp.category}</span>
                </div>
                <span className="text-gray-300 text-xs flex-shrink-0">{new Date(mp.completed_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-sm">No modules completed yet. <Link to="/" className="text-[#2CC4BD] hover:underline">Start learning →</Link></p>
        )}
      </div>

      {/* Change Password */}
      <div className="card mb-5">
        <h2 className="font-bold text-navy text-base mb-4">Change Password</h2>
        <form onSubmit={submitPw} className="space-y-3 max-w-sm">
          <div>
            <label className="label">Current Password</label>
            <input name="currentPassword" type="password" value={pwForm.currentPassword} onChange={handlePw} className="input" required placeholder="••••••••" />
          </div>
          <div>
            <label className="label">New Password</label>
            <input name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePw} className="input" required placeholder="••••••••" />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input name="confirmPassword" type="password" value={pwForm.confirmPassword} onChange={handlePw} className="input" required placeholder="••••••••" />
          </div>
          {pwError && <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{pwError}</div>}
          {pwSuccess && <div className="text-emerald-600 text-sm bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">{pwSuccess}</div>}
          <button type="submit" disabled={pwLoading} className="btn-primary py-2.5 text-sm px-6">
            {pwLoading ? 'Saving…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Quiz history */}
      <div className="card">
        <h2 className="font-bold text-navy text-base mb-4">Quiz History</h2>
        {quizAttempts.length === 0 ? (
          <p className="text-gray-300 text-sm">No quiz attempts yet. <Link to="/" className="text-[#2CC4BD] hover:underline">Take a quiz →</Link></p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Quiz</th>
                  <th className="text-center py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Score</th>
                  <th className="text-center py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Result</th>
                  <th className="text-right py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {quizAttempts.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-medium text-gray-700">{a.quiz_title}</td>
                    <td className="py-3 text-center font-bold text-navy">{a.score}%</td>
                    <td className="py-3 text-center">
                      <span className={a.passed ? 'badge-pass' : 'badge-fail'}>
                        {a.passed ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-300 text-xs">
                      {new Date(a.completed_at).toLocaleDateString()}
                    </td>
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
