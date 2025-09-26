import { useState, useEffect } from 'react';
import type { Teacher } from '../../types';
import { TeachingLocation } from '../../types';
import teacherService from '../../services/teacherService';

interface EditProfileFormProps {
  teacher: Teacher;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditProfileForm = ({ teacher, onSuccess, onCancel }: EditProfileFormProps) => {
  const [formData, setFormData] = useState({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    subject: teacher.subject,
    hourlyRate: teacher.hourlyRate,
    skills: teacher.skills || '',
    bio: teacher.bio || '',
    teachingLocations: teacher.teachingLocations || [],
    profilePicture: teacher.profilePicture || ''
  });

  const [profileImage, setProfileImage] = useState<string | null>(teacher.profilePicture || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const location = value as TeachingLocation;
    
    setFormData(prev => ({
      ...prev,
      teachingLocations: checked
        ? [...prev.teachingLocations, location]
        : prev.teachingLocations.filter((loc: TeachingLocation) => loc !== location)
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Uploader la photo immédiatement
        const photoUrl = await teacherService.uploadProfilePicture(teacher.id, file);
        
        // Créer une URL temporaire pour l'aperçu
        const tempUrl = URL.createObjectURL(file);
        setProfileImage(tempUrl);
        
        // Mettre à jour le formulaire avec l'URL de la photo uploadée
        setFormData(prev => ({
          ...prev,
          profilePicture: photoUrl
        }));
        
        // Nettoyer l'URL temporaire après un délai
        setTimeout(() => URL.revokeObjectURL(tempUrl), 1000);
        
      } catch (err) {
        setError('Erreur lors de l\'upload de l\'image');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim()) {
      setError('Le prénom est requis');
      return;
    }
    
    if (!formData.lastName.trim()) {
      setError('Le nom de famille est requis');
      return;
    }
    
    if (!formData.subject.trim()) {
      setError('La matière est requise');
      return;
    }
    
    if (!formData.hourlyRate || isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
      setError('Le tarif horaire doit être un nombre positif');
      return;
    }
    
    if (formData.teachingLocations.length === 0) {
      setError('Au moins un lieu d\'enseignement est requis');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await teacherService.updateTeacherProfile(teacher.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        subject: formData.subject,
        hourlyRate: Number(formData.hourlyRate),
        skills: formData.skills,
        bio: formData.bio,
        teachingLocations: formData.teachingLocations,
        profilePicture: formData.profilePicture
      });
      
      onSuccess();
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour du profil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Modifier mon profil</h2>
      
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
              className="input-field"
              placeholder="Votre prénom"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-2">
              Nom de famille
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="input-field"
              placeholder="Votre nom de famille"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Photo de profil */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Photo de profil
          </label>
          <div className="flex items-center space-x-4">
            {profileImage && (
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                <img 
                  src={profileImage} 
                  alt="Photo de profil" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="profilePicture"
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {profileImage ? 'Changer la photo' : 'Ajouter une photo'}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Formats acceptés: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-2">
            Matière principale
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="input-field"
            placeholder="Ex: Mathématiques, Français, Anglais..."
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="hourlyRate" className="block text-gray-700 text-sm font-medium mb-2">
            Tarif horaire (FCFA)
          </label>
          <input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            className="input-field"
            placeholder="Ex: 25000"
            value={formData.hourlyRate}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        
        <div>
          <label htmlFor="skills" className="block text-gray-700 text-sm font-medium mb-2">
            Compétences
          </label>
          <textarea
            id="skills"
            name="skills"
            className="input-field h-20 resize-none"
            placeholder="Décrivez vos compétences et spécialités..."
            value={formData.skills}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-gray-700 text-sm font-medium mb-2">
            Biographie
          </label>
          <textarea
            id="bio"
            name="bio"
            className="input-field h-24 resize-none"
            placeholder="Parlez de votre expérience et de votre approche pédagogique..."
            value={formData.bio}
            onChange={handleChange}
          />
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
                name="locations"
                value={TeachingLocation.ONLINE}
                onChange={handleLocationChange}
                checked={formData.teachingLocations.includes(TeachingLocation.ONLINE)}
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
                name="locations"
                value={TeachingLocation.HOME}
                onChange={handleLocationChange}
                checked={formData.teachingLocations.includes(TeachingLocation.HOME)}
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
                name="locations"
                value={TeachingLocation.TEACHER_PLACE}
                onChange={handleLocationChange}
                checked={formData.teachingLocations.includes(TeachingLocation.TEACHER_PLACE)}
                className="mr-2"
              />
              <label htmlFor="teacherPlace" className="text-gray-700">
                {TeachingLocation.TEACHER_PLACE}
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Mise à jour en cours...' : 'Mettre à jour le profil'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm; 