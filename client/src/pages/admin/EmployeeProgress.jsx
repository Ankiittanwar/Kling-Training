import { useEffect, useState } from 'react';
import api from '../../api';

export default function EmployeeProgress() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '' });
  const [addError, setAddError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  function fetchEmployees() {
    return api.get('/admin/employees').then(r => setEmployees(r.data));
  }

  useEffect(() => { fetchEmployees().finally(() => setLoading(false)); }, []);

  function selectEmployee(e) {
    setSelected(e);
    api.get(`/admin/employees/${e.id}`).then(r => setDetail(r.data));
  }

  async function addEmployee(ev) {
    ev.preventDefault();
    setAddError('');
    try {
      await api.post('/admin/employees', addForm);
      setShowAdd(false);
      setAddForm({ name: '', email: '', password: '' });
      fetchEmployees();
    } catch (err) {
      setAddError(err.response?.data?.error || 'Error adding employee');
    }
  }

  async function deleteEmployee(id) {
    await api.delete(`/admin/employees/${id}`);
    setDeleteId(null);
    if (selected?.id === id) { setSelected(null); setDetail(null); }
    fetchEmployees();
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading…</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Employee Progress</h1>
          <p className="text-gray-500 text-sm">{employees.length} employees</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">+ Add Employee</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee table */}
        <div className="card overflow-x-auto">
          <h2 className="font-bold text-navy mb-4">All Employees</h2>
          {employees.length === 0 ? (
            <p className="text-gray-400 text-sm">No employees yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">Name</th>
                  <th className="text-center py-2 text-gray-500 font-medium">Modules</th>
                  <th className="text-center py-2 text-gray-500 font-medium">Avg</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(e => (
                  <tr
                    key={e.id}
                    onClick={() => selectEmployee(e)}
                    className={`border-b border-gray-100 last:border-0 cursor-pointer transition-colors ${selected?.id === e.id ? 'bg-navy/5' : 'hover:bg-gray-50'}`}
                  >
                    <td className="py-2.5">
                      <div className="font-medium text-gray-800">{e.name}</div>
                      <div className="text-xs text-gray-400">{e.email}</div>
                    </td>
                    <td className="py-2.5 text-center font-bold text-navy">{e.modulesCompleted}</td>
                    <td className="py-2.5 text-center">
                      {e.avgScore !== null ? (
                        <span className={e.avgScore >= 70 ? 'badge-pass' : 'badge-fail'}>{e.avgScore}%</span>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={ev => { ev.stopPropagation(); setDeleteId(e.id); }}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        <div>
          {!selected ? (
            <div className="card text-center text-gray-400 py-16">Click an employee to see their full progress</div>
          ) : !detail ? (
            <div className="card text-center text-gray-400 py-16">Loading…</div>
          ) : (
            <div className="card">
              <h2 className="font-bold text-navy text-lg">{detail.name}</h2>
              <p className="text-sm text-gray-400">{detail.email}</p>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 text-sm mb-2">Modules Completed ({detail.modulesCompleted.length})</h3>
                {detail.modulesCompleted.length === 0 ? (
                  <p className="text-gray-400 text-xs">None yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {detail.modulesCompleted.map(m => (
                      <div key={m.module_id} className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-green-500">✓</span>
                          <span className="text-gray-700">{m.module_title}</span>
                          <span className="badge-category">{m.category}</span>
                        </div>
                        <span className="text-gray-400">{new Date(m.completed_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5">
                <h3 className="font-semibold text-gray-700 text-sm mb-2">Quiz History ({detail.quizAttempts.length})</h3>
                {detail.quizAttempts.length === 0 ? (
                  <p className="text-gray-400 text-xs">No attempts yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {detail.quizAttempts.map(a => (
                      <div key={a.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                        <span className="text-gray-700 truncate mr-2">{a.quiz_title}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-bold text-navy">{a.score}%</span>
                          <span className={a.passed ? 'badge-pass' : 'badge-fail'}>{a.passed ? 'Pass' : 'Fail'}</span>
                          <span className="text-gray-400">{new Date(a.completed_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add employee modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-navy text-lg mb-4">Add Employee</h3>
            <form onSubmit={addEmployee} className="space-y-3">
              <div><label className="label">Name *</label><input className="input" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div><label className="label">Email *</label><input type="email" className="input" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} required /></div>
              <div><label className="label">Password *</label><input type="password" className="input" value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} required /></div>
              {addError && <p className="text-red-600 text-sm">{addError}</p>}
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-primary flex-1">Add</button>
                <button type="button" onClick={() => setShowAdd(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900">Remove Employee?</h3>
            <p className="text-gray-500 text-sm mt-2">All their progress data will be removed.</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => deleteEmployee(deleteId)} className="btn-danger flex-1">Remove</button>
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
