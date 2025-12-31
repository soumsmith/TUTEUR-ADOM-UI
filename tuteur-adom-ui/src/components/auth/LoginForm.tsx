import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginRequest, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import type { RootState } from '../../redux/store';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      dispatch(loginRequest());
      const response = await authService.login({ email, password });
      dispatch(loginSuccess(response));
      
      // Redirection en fonction du rôle de l'utilisateur
      if (response.user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (response.user.role === 'parent') {
        navigate('/parent/dashboard');
      } else if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      dispatch(loginFailure(err instanceof Error ? err.message : 'Échec de connexion'));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg">
      {/* <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Connexion</h2> */}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="input-field"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            className="input-field"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </div>
      </form>
      
      <div className="text-center text-gray-600 dark:text-gray-400">
        <p>
          Vous n'avez pas de compte ?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 