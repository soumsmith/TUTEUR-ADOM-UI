import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TeacherRegistrationForm from '../components/auth/TeacherRegistrationForm';
import type { RootState } from '../redux/store';

const TeacherRegisterPage = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (user.role === 'parent') {
        navigate('/parent/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Devenir enseignant sur Tuteur-Adom
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          Créez votre profil d'enseignant pour proposer vos services de cours particuliers
        </p>
      </div>
      
      <TeacherRegistrationForm />
    </div>
  );
};

export default TeacherRegisterPage; 