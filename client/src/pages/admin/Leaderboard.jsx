import { useEffect, useState } from 'react';
import api from '../../api';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/leaderboard').then(r => setRows(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Leaderboard</h1>
        <p className="text-gray-500">Ranked by average quiz score (best attempt per quiz)</p>
      </div>

      {/* Top 3 podium */}
      {rows.length >= 3 && (
        <div className="flex items-end justify-center gap-2 sm:gap-4 mb-8">
          {[rows[1], rows[0], rows[2]].map((r, i) => {
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const heights = ['h-24', 'h-32', 'h-20'];
            return (
              <div key={r.id} className="flex flex-col items-center">
                <div className="text-2xl mb-1">{MEDALS[actualRank - 1]}</div>
                <div className={`${heights[i]} w-20 rounded-t-xl flex flex-col items-center justify-end pb-2 ${
                  actualRank === 1 ? 'bg-gold' : actualRank === 2 ? 'bg-gray-300' : 'bg-amber-600/60'
                }`}>
                  <div className="text-white font-bold text-sm">{r.avgScore}%</div>
                </div>
                <div className="text-xs font-medium text-gray-700 mt-1 text-center w-20 truncate">{r.name}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full table */}
      <div className="card overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No quiz data yet.</p>
        ) : (
          <table className="w-full text-sm min-w-[360px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-500 font-medium w-12">Rank</th>
                <th className="text-left py-2 text-gray-500 font-medium">Employee</th>
                <th className="text-center py-2 text-gray-500 font-medium">Avg Score</th>
                <th className="text-center py-2 text-gray-500 font-medium">Quizzes</th>
                <th className="text-center py-2 text-gray-500 font-medium">Modules</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className={`border-b border-gray-100 last:border-0 ${r.rank <= 3 ? 'bg-[#2CC4BD]/5' : ''}`}>
                  <td className="py-3 font-bold text-center">
                    {r.rank <= 3 ? MEDALS[r.rank - 1] : <span className="text-gray-400">#{r.rank}</span>}
                  </td>
                  <td className="py-3 font-medium text-gray-800">{r.name}</td>
                  <td className="py-3 text-center">
                    {r.avgScore !== null ? (
                      <span className={`font-bold text-base ${r.avgScore >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                        {r.avgScore}%
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-3 text-center text-navy font-medium">{r.quizzesAttempted}</td>
                  <td className="py-3 text-center text-navy font-medium">{r.modulesCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
