import React from 'react';
import { Link } from 'react-router-dom';
import type { Teacher } from '../../types';
import { formatHourlyRate } from '../../utils/currency';

// Fonction pour générer une image d'avatar par défaut
const getDefaultAvatar = (firstName: string, lastName: string) => {
  const seed = `${firstName}-${lastName}`.toLowerCase();
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

interface TeacherCardProps {
  teacher: Teacher;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <img
            src={teacher.profilePicture || getDefaultAvatar(teacher.firstName, teacher.lastName)}
            alt={`${teacher.firstName} ${teacher.lastName}`}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              // En cas d'erreur de chargement, utiliser l'avatar par défaut
              const target = e.target as HTMLImageElement;
              target.src = getDefaultAvatar(teacher.firstName, teacher.lastName);
            }}
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {teacher.firstName} {teacher.lastName}
          </h3>
          
          <p className="text-md font-medium text-blue-600 mb-1">
            {teacher.subject}
          </p>
          
          <div className="flex items-center mb-2">
            <span className="text-yellow-500 mr-1">
              {teacher.rating ? '★'.repeat(Math.floor(teacher.rating)) + (teacher.rating % 1 >= 0.5 ? '½' : '') : ''}
            </span>
            <span className="text-sm text-gray-500">
              {teacher.rating ? `(${teacher.rating.toFixed(1)})` : 'Nouvel enseignant'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {teacher.teachingLocations && teacher.teachingLocations.length > 0 ? (
              teacher.teachingLocations.map((location, index) => (
                <span 
                  key={index} 
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {location}
                </span>
              ))
            ) : (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                Non spécifié
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">{formatHourlyRate(teacher.hourlyRate)}</span>
            <Link 
              to={`/teachers/${teacher.id}`} 
              className="btn-primary text-sm py-1"
            >
              Voir profil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard; 