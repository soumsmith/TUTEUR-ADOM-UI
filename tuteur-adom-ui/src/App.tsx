import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import TeachersListPage from './pages/TeachersListPage';
import TeacherProfilePage from './pages/TeacherProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterOptionsPage from './pages/RegisterOptionsPage';
import TeacherRegisterPage from './pages/TeacherRegisterPage';
import ParentRegisterPage from './pages/ParentRegisterPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import ParentDashboardPage from './pages/ParentDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Styles
import './App.css';

// Composant de route protégée
const PrivateRoute = ({ children, roles }: { children: React.ReactNode; roles: string[] }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user && roles.includes(user.role)) {
    return <>{children}</>;
  }
  
  // Si l'utilisateur n'a pas le bon rôle, rediriger vers l'accueil
  return <Navigate to="/" />;
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
