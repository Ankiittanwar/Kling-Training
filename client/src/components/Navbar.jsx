import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const isAdmin = user?.role === 'admin';

  const employeeLinks = [
    { to: '/', label: 'Learn' },
    { to: '/dashboard', label: 'My Dashboard' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/modules', label: 'Modules' },
    { to: '/admin/quizzes', label: 'Quizzes' },
    { to: '/admin/employees', label: 'Employees' },
    { to: '/admin/leaderboard', label: 'Leaderboard' },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: logo + divider + nav links (desktop) */}
          <div className="flex items-center gap-6">
            <Link to={isAdmin ? '/admin' : '/'} className="flex-shrink-0">
              <img
                src="https://cdn.shopify.com/s/files/1/0691/0063/4326/files/Kling-logo.png?v=1706632130"
                alt="Kling Trading"
                className="h-8 w-auto object-contain"
              />
            </Link>

            <div className="hidden md:block w-px h-5 bg-gray-200" />

            <div className="hidden md:flex items-center gap-0.5">
              {links.map(l => {
                const active = pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active ? '' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                    style={active ? { backgroundColor: '#2CC4BD', color: 'white' } : {}}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: avatar + sign out + hamburger */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: '#0F1923' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize leading-tight">{user?.role}</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-5 bg-gray-200" />

            <button
              onClick={handleLogout}
              className="hidden sm:block text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              Sign out
            </button>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3">
          <div className="space-y-1 mb-3">
            {links.map(l => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={active ? { backgroundColor: '#2CC4BD' } : {}}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: '#0F1923' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="text-xs font-medium text-gray-400 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
