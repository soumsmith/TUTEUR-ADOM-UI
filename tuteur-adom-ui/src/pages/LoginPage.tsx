import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginForm from '../components/auth/LoginForm';
import type { RootState } from '../redux/store';

const LoginPage = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirection automatique après connexion
  useEffect(() => {
    if (isAuthenticated && user) {
      const state = location.state as { from?: string };
      const from = state?.from || getDashboardPathForRole(user.role);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);
  
  const getDashboardPathForRole = (role: string): string => {
    switch (role) {
      case 'teacher':
        return '/teacher/dashboard';
      case 'parent':
        return '/parent/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 