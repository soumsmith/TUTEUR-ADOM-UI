import { Link } from 'react-router-dom';
import type { Teacher } from '../../types';

interface TeacherCardProps {
  teacher: Teacher;
}

const TeacherCard = ({ teacher }: TeacherCardProps) => {
  // Vérification de sécurité si les données de l'enseignant sont manquantes
  if (!teacher) {
    return (
      <div className="card hover:shadow-lg transition-shadow p-4">
        <div className="text-center text-gray-500">
          Informations de l'enseignant non disponibles
        </div>
      </div>
    );
  }

  // Générer les étoiles pour l'affichage de la note
  const renderRating = () => {
    if (!teacher.rating) return 'Nouvel enseignant';
    
    const fullStars = Math.floor(teacher.rating);
    const hasHalfStar = teacher.rating % 1 >= 0.5;
    
    return (
      <>
        <span className="text-yellow-500 mr-1">
          {'★'.repeat(fullStars)}{hasHalfStar ? '½' : ''}
        </span>
        <span className="text-sm text-gray-500">
          ({teacher.rating.toFixed(1)})
        </span>
      </>
    );
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start">
        <div className="mr-4">
          <img
            src={teacher.profilePicture || '/default-avatar.png'}
            alt={`${teacher.firstName} ${teacher.lastName}`}
            className="w-20 h-20 rounded-full object-cover"
            onError={(e) => {
              // Fallback si l'image ne se charge pas
              e.currentTarget.src = '/default-avatar.png';
            }}
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {teacher.firstName} {teacher.lastName}
          </h3>

          <p className="text-md font-medium text-orange mb-1">
            {teacher.subject}
          </p>

          <div className="flex items-center mb-2">
            {renderRating()}
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {Array.isArray(teacher.teachingLocation) && teacher.teachingLocation.map((location, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {location}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">{teacher.hourlyRate} €/h</span>
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