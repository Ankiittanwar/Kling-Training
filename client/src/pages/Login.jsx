import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (mode === 'register' && !form.email.endsWith('@klingtravel.com')) {
      setError('Only @klingtravel.com email addresses can register');
      setLoading(false);
      return;
    }
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      login(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0d1f2d 0%, #0f2a3a 50%, #0a1e2e 100%)' }}
      >

        <div className="relative z-10 text-center">
          {/* Rings + all content inside */}
          <div className="relative flex items-center justify-center" style={{ width: '420px', height: '420px' }}>
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-white/10" />
            {/* Middle ring */}
            <div className="absolute rounded-full border border-white/15" style={{ width: '340px', height: '340px' }} />
            {/* Inner ring */}
            <div className="absolute rounded-full border border-white/20" style={{ width: '260px', height: '260px' }} />

            {/* Content centered inside rings */}
            <div className="relative flex flex-col items-center gap-3">
              <div className="bg-white rounded-xl px-7 py-4 shadow-xl">
                <img
                  src="https://cdn.shopify.com/s/files/1/0691/0063/4326/files/Kling-logo.png?v=1706632130"
                  alt="Kling Trading"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <h2 className="text-white text-base font-semibold tracking-wide">
                One Team. One Platform.
              </h2>
              <p className="text-white/40 text-xs tracking-wide">
                Kling Trading Internal Platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <img
              src="https://cdn.shopify.com/s/files/1/0691/0063/4326/files/Kling-logo.png?v=1706632130"
              alt="Kling Trading"
              className="h-10 w-auto object-contain mx-auto mb-2"
            />
            <p className="text-gray-400 text-sm">Staff Training Portal</p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {mode === 'login' ? 'Sign in to your training account' : 'Register to get started'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-7">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  mode === m
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="label">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handle}
                  placeholder="Your full name"
                  className="input"
                  required
                />
              </div>
            )}
            <div>
              <label className="label">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                placeholder="you@klingtravel.com"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handle}
                placeholder="••••••••"
                className="input"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm mt-2"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
