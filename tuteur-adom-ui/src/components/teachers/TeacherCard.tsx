import { Link } from 'react-router-dom';
import type { Teacher } from '../../types';

interface TeacherCardProps {
  teacher: Teacher;
}

const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start">
        <div className="mr-4">
          <img
            src={teacher.profilePicture || '/default-avatar.png'}
            alt={`${teacher.firstName} ${teacher.lastName}`}
            className="w-20 h-20 rounded-full object-cover"
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
            {teacher.teachingLocation.map((location, index) => (
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