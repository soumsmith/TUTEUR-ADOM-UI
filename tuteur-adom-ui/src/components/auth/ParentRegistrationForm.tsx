import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest, registerSuccess, registerFailure } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import type { RootState } from '../../redux/store';

interface ChildData {
  name: string;
  age: string;
  grade: string;
}

const ParentRegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const [children, setChildren] = useState<ChildData[]>([]);
  const [currentChild, setCurrentChild] = useState<ChildData>({
    name: '',
    age: '',
    grade: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChildChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentChild({
      ...currentChild,
      [name]: value,
    });
  };

  const addChild = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de base pour les données de l'enfant
    if (!currentChild.name || !currentChild.age || !currentChild.grade) {
      setErrors({
        ...errors,
        child: 'Tous les champs sont requis pour ajouter un enfant'
      });
      return;
    }
    
    // Ajout de l'enfant à la liste
    setChildren([...children, { ...currentChild }]);
    
    // Réinitialisation du formulaire enfant
    setCurrentChild({
      name: '',
      age: '',
      grade: '',
    });
    
    // Suppression de l'erreur si elle existe
    if (errors.child) {
      const newErrors = { ...errors };
      delete newErrors.child;
      setErrors(newErrors);
    }
  };

  const removeChild = (index: number) => {
    const updatedChildren = [...children];
    updatedChildren.splice(index, 1);
    setChildren(updatedChildren);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (!formData.firstName) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      dispatch(registerRequest());
      
      // Conversion des données des enfants pour correspondre à l'API
      const childrenData = children.map(child => ({
        name: child.name,
        age: parseInt(child.age),
        grade: child.grade
      }));
      
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        children: childrenData
      };
      
      const response = await authService.registerParent(userData);
      
      dispatch(registerSuccess(response));
      navigate('/parent/dashboard');
    } catch (err) {
      dispatch(registerFailure(err instanceof Error ? err.message : 'Échec de l\'inscription'));
    }
  };

  return (
    <div className="">
      {/* <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Inscription Parent</h2> */}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Prénom
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="Votre prénom"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Nom
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Votre nom"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Votre adresse email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`input-field ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirmez votre mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informations des enfants (optionnel)</h3>
          
          {/* Liste des enfants ajoutés */}
          {children.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Enfants ajoutés:</h4>
              <div className="space-y-2">
                {children.map((child, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <span className="font-medium">{child.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">{child.age} ans, {child.grade}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeChild(index)}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Formulaire pour ajouter un enfant */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Ajouter un enfant</h4>
            {errors.child && <p className="text-red-500 text-xs mb-2">{errors.child}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label htmlFor="childName" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                  Nom de l'enfant
                </label>
                <input
                  type="text"
                  id="childName"
                  name="name"
                  className="input-field"
                  placeholder="Nom"
                  value={currentChild.name}
                  onChange={handleChildChange}
                />
              </div>
              
              <div>
                <label htmlFor="childAge" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                  Âge
                </label>
                <input
                  type="number"
                  id="childAge"
                  name="age"
                  className="input-field"
                  placeholder="Âge"
                  min="1"
                  max="18"
                  value={currentChild.age}
                  onChange={handleChildChange}
                />
              </div>
              
              <div>
                <label htmlFor="childGrade" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                  Niveau scolaire
                </label>
                <select
                  id="childGrade"
                  name="grade"
                  className="input-field"
                  value={currentChild.grade}
                  onChange={handleChildChange}
                >
                  <option value="">Sélectionner</option>
                  <option value="CP">CP</option>
                  <option value="CE1">CE1</option>
                  <option value="CE2">CE2</option>
                  <option value="CM1">CM1</option>
                  <option value="CM2">CM2</option>
                  <option value="6ème">6ème</option>
                  <option value="5ème">5ème</option>
                  <option value="4ème">4ème</option>
                  <option value="3ème">3ème</option>
                  <option value="2nde">2nde</option>
                  <option value="1ère">1ère</option>
                  <option value="Terminale">Terminale</option>
                  <option value="Supérieur">Supérieur</option>
                </select>
              </div>
            </div>
            
            <button
              type="button"
              onClick={addChild}
              className="btn-secondary text-sm py-1 px-3"
            >
              Ajouter
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
        <p>
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ParentRegistrationForm; 