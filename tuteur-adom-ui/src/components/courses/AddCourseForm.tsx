import { useState } from 'react';
import { TeachingLocation } from '../../types';
import courseService from '../../services/courseService';

interface AddCourseFormProps {
  teacherId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddCourseForm = ({ teacherId, onSuccess, onCancel }: AddCourseFormProps) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    hourlyRate: '',
    locations: [] as TeachingLocation[]
  });

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
      locations: checked
        ? [...prev.locations, location]
        : prev.locations.filter(loc => loc !== location)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim()) {
      setError('La matière est requise');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('La description est requise');
      return;
    }
    
    if (!formData.hourlyRate || isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
      setError('Le tarif horaire doit être un nombre positif');
      return;
    }
    
    if (formData.locations.length === 0) {
      setError('Au moins un lieu d\'enseignement est requis');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await courseService.createCourse(teacherId, {
        subject: formData.subject,
        description: formData.description,
        hourlyRate: Number(formData.hourlyRate),
        locations: formData.locations
      });
      
      onSuccess();
    } catch (err) {
      setError('Une erreur est survenue lors de la création du cours');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Ajouter un nouveau cours</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-2">
            Matière
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="input-field"
            placeholder="Ex: Mathématiques - Niveau Collège"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="input-field h-24 resize-none"
            placeholder="Décrivez le contenu et les objectifs du cours..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="hourlyRate" className="block text-gray-700 text-sm font-medium mb-2">
            Tarif horaire (€)
          </label>
          <input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            className="input-field"
            placeholder="Ex: 25"
            value={formData.hourlyRate}
            onChange={handleChange}
            min="1"
            required
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
            {loading ? 'Création en cours...' : 'Créer le cours'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm; 