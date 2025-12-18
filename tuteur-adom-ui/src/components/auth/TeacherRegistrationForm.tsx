import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest, registerSuccess, registerFailure } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import type { RootState } from '../../redux/store';
import { TeachingLocation } from '../../types';

const TeacherRegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    subject: '',
    hourlyRate: '',
    teachingLocation: [] as TeachingLocation[],
    skills: '',
    bio: '',
    cv: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          cv: 'Le fichier est trop volumineux. Taille maximale : 5MB'
        });
        return;
      }
      // Vérifier le type de fichier
      if (!file.type.includes('pdf')) {
        setErrors({
          ...errors,
          cv: 'Seuls les fichiers PDF sont acceptés'
        });
        return;
      }
      setFormData({
        ...formData,
        cv: file
      });
      // Supprimer l'erreur si elle existe
      if (errors.cv) {
        const newErrors = { ...errors };
        delete newErrors.cv;
        setErrors(newErrors);
      }
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const location = value as TeachingLocation;
    
    setFormData(prev => ({
      ...prev,
      teachingLocation: checked
        ? [...prev.teachingLocation, location]
        : prev.teachingLocation.filter(loc => loc !== location)
    }));
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
    
    if (!formData.subject) {
      newErrors.subject = 'La matière est requise';
    }
    
    if (!formData.hourlyRate) {
      newErrors.hourlyRate = 'Le tarif horaire est requis';
    } else if (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = 'Le tarif horaire doit être un nombre positif';
    }
    
    if (formData.teachingLocation.length === 0) {
      newErrors.teachingLocation = 'Au moins un lieu d\'enseignement est requis';
    }
    
    if (!formData.skills) {
      newErrors.skills = 'Les compétences sont requises';
    }
    
    if (!formData.bio) {
      newErrors.bio = 'La bio est requise';
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

      // Convertir le CV en base64 si présent
      let cvData = '';
      if (formData.cv) {
        const reader = new FileReader();
        cvData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.cv as File);
        });
      }
      
      const response = await authService.registerTeacher({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        subject: formData.subject,
        hourlyRate: Number(formData.hourlyRate),
        teachingLocation: formData.teachingLocation,
        skills: formData.skills,
        bio: formData.bio,
        cv: cvData
      });
      
      dispatch(registerSuccess(response));
      navigate('/teacher/dashboard');
    } catch (err) {
      dispatch(registerFailure(err instanceof Error ? err.message : 'Échec de l\'inscription'));
    }
  };

  return (
    <div className="p-6">
      {/* <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Inscription Enseignant</h2> */}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-2">
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
            <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-2">
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
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
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
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
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
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
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
        
        <div>
          <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-2">
            Matière enseignée
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
            placeholder="Ex: Mathématiques, Français, Physique..."
            value={formData.subject}
            onChange={handleChange}
          />
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
        </div>
        
        <div>
          <label htmlFor="hourlyRate" className="block text-gray-700 text-sm font-medium mb-2">
            Tarif horaire (FCFA)
          </label>
          <input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            className={`input-field ${errors.hourlyRate ? 'border-red-500' : ''}`}
            placeholder="Ex: 25"
            value={formData.hourlyRate}
            onChange={handleChange}
            min="1"
          />
          {errors.hourlyRate && <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Lieux d'enseignement
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="online"
                name="teachingLocation"
                value={TeachingLocation.ONLINE}
                onChange={handleLocationChange}
                className="mr-2"
              />
              <label htmlFor="online" className="text-gray-700">
                {TeachingLocation.ONLINE}
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="home"
                name="teachingLocation"
                value={TeachingLocation.HOME}
                onChange={handleLocationChange}
                className="mr-2"
              />
              <label htmlFor="home" className="text-gray-700">
                {TeachingLocation.HOME}
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="teacherPlace"
                name="teachingLocation"
                value={TeachingLocation.TEACHER_PLACE}
                onChange={handleLocationChange}
                className="mr-2"
              />
              <label htmlFor="teacherPlace" className="text-gray-700">
                {TeachingLocation.TEACHER_PLACE}
              </label>
            </div>
          </div>
          {errors.teachingLocation && <p className="text-red-500 text-xs mt-1">{errors.teachingLocation}</p>}
        </div>
        
        <div>
          <label htmlFor="skills" className="block text-gray-700 text-sm font-medium mb-2">
            Compétences
          </label>
          <textarea
            id="skills"
            name="skills"
            className={`input-field h-24 resize-none ${errors.skills ? 'border-red-500' : ''}`}
            placeholder="Décrivez vos compétences et qualifications"
            value={formData.skills}
            onChange={handleChange}
          />
          {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-gray-700 text-sm font-medium mb-2">
            Biographie
          </label>
          <textarea
            id="bio"
            name="bio"
            className={`input-field h-32 resize-none ${errors.bio ? 'border-red-500' : ''}`}
            placeholder="Parlez de vous, votre expérience..."
            value={formData.bio}
            onChange={handleChange}
          />
          {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
        </div>
        
        <div>
          <label htmlFor="cv" className="block text-gray-700 text-sm font-medium mb-2">
            CV (PDF, max 5MB)
          </label>
          <input
            type="file"
            id="cv"
            name="cv"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {errors.cv && <p className="text-red-500 text-xs mt-1">{errors.cv}</p>}
          <p className="text-gray-500 text-xs mt-1">
            Ajoutez votre CV pour augmenter vos chances d'être sélectionné par les parents.
          </p>
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
      
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TeacherRegistrationForm; 