import { useState } from 'react';
import type { Parent } from '../../types';

interface EditParentFormProps {
  parent: Parent;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditParentForm = ({ parent, onSuccess, onCancel }: EditParentFormProps) => {
  const [formData, setFormData] = useState({
    firstName: parent.firstName,
    lastName: parent.lastName,
    email: parent.email
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim()) {
      setError('Le prénom est requis');
      return;
    }
    
    if (!formData.lastName.trim()) {
      setError('Le nom est requis');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implémenter la mise à jour du profil parent via l'API
      console.log('Mise à jour du profil parent:', formData);
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
        <div>
          <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-2">
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="input-field"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-2">
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="input-field"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
          />
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
            {loading ? 'Mise à jour en cours...' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditParentForm; 