import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages publiques
import HomePage from './pages/HomePage';
import TeachersListPage from './pages/TeachersListPage';
import TeacherProfilePage from './pages/TeacherProfilePage';

// Pages d'authentification
import LoginPage from './pages/LoginPage';
import RegisterOptionsPage from './pages/RegisterOptionsPage';
import TeacherRegisterPage from './pages/TeacherRegisterPage';
import ParentRegisterPage from './pages/ParentRegisterPage';

// Pages protégées
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import ParentDashboardPage from './pages/ParentDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Route protégée qui vérifie l'authentification et le rôle
const PrivateRoute = ({ children, roles }: { children: JSX.Element, roles: string[] }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (roles && roles.length > 0 && user && !roles.includes(user.role)) {
    // Redirige vers une page appropriée en fonction du rôle
    if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" />;
    } else if (user.role === 'parent') {
      return <Navigate to="/parent/dashboard" />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-100 py-6">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/teachers" element={<TeachersListPage />} />
            <Route path="/teachers/:id" element={<TeacherProfilePage />} />
            
            {/* Routes d'authentification */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterOptionsPage />} />
            <Route path="/register/teacher" element={<TeacherRegisterPage />} />
            <Route path="/register/parent" element={<ParentRegisterPage />} />
            
            {/* Routes protégées */}
            <Route 
              path="/teacher/dashboard" 
              element={
                <PrivateRoute roles={['teacher']}>
                  <TeacherDashboardPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/parent/dashboard" 
              element={
                <PrivateRoute roles={['parent']}>
                  <ParentDashboardPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminDashboardPage />
                </PrivateRoute>
              } 
            />
            
            {/* Route par défaut */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
