import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import LearningHub from './pages/LearningHub';
import ModuleViewer from './pages/ModuleViewer';
import Quiz from './pages/Quiz';
import MyDashboard from './pages/MyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ModuleEditor from './pages/admin/ModuleEditor';
import QuizBuilder from './pages/admin/QuizBuilder';
import EmployeeProgress from './pages/admin/EmployeeProgress';
import Leaderboard from './pages/admin/Leaderboard';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/'} /> : <Login />} />

      {/* Employee routes */}
      <Route path="/" element={<ProtectedRoute><Layout><LearningHub /></Layout></ProtectedRoute>} />
      <Route path="/modules/:id" element={<ProtectedRoute><Layout><ModuleViewer /></Layout></ProtectedRoute>} />
      <Route path="/quiz/:id" element={<ProtectedRoute><Layout><Quiz /></Layout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><MyDashboard /></Layout></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
      <Route path="/admin/modules" element={<ProtectedRoute adminOnly><Layout><ModuleEditor /></Layout></ProtectedRoute>} />
      <Route path="/admin/quizzes" element={<ProtectedRoute adminOnly><Layout><QuizBuilder /></Layout></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute adminOnly><Layout><EmployeeProgress /></Layout></ProtectedRoute>} />
      <Route path="/admin/leaderboard" element={<ProtectedRoute adminOnly><Layout><Leaderboard /></Layout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/') : '/login'} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
