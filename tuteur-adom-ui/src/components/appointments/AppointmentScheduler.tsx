import { useState } from 'react';
import { TeachingLocation } from '../../types';
import requestService from '../../services/requestService';

interface AppointmentSchedulerProps {
  requestId: string;
  teacherId: string;
  parentId: string;
  onScheduled: () => void;
  onCancel: () => void;
}

const AppointmentScheduler = ({ requestId, teacherId, parentId, onScheduled, onCancel }: AppointmentSchedulerProps) => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: TeachingLocation.ONLINE,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation de base
      const selectedDate = new Date(formData.date);
      if (selectedDate < new Date()) {
        throw new Error('La date sélectionnée doit être dans le futur');
      }

      if (formData.startTime >= formData.endTime) {
        throw new Error('L\'heure de fin doit être après l\'heure de début');
      }

      await requestService.createAppointment({
        requestId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location
      });

      onScheduled();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la programmation du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Programmer un rendez-vous</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="input-field"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Heure de début
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              className="input-field"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              Heure de fin
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              className="input-field"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Lieu
          </label>
          <select
            id="location"
            name="location"
            className="input-field"
            value={formData.location}
            onChange={handleChange}
            required
          >
            <option value={TeachingLocation.ONLINE}>En ligne</option>
            <option value={TeachingLocation.HOME}>À domicile</option>
            <option value={TeachingLocation.TEACHER_PLACE}>Chez l'enseignant</option>
          </select>
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
            {loading ? 'Programmation...' : 'Programmer le rendez-vous'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentScheduler; 