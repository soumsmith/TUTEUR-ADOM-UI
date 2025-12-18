import React from 'react';
import { Link } from 'react-router-dom';
import type { Teacher } from '../../types';
import { formatHourlyRate } from '../../utils/currency';
import { 
  Star, 
  MapPin, 
  GraduationCap,
  Calendar,
  CheckCircle,
  Globe,
  Home,
  User
} from 'lucide-react';

// Fonction pour générer une image d'avatar par défaut
const getDefaultAvatar = (firstName: string, lastName: string) => {
  const seed = `${firstName}-${lastName}`.toLowerCase();
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

interface TeacherCardProps {
  teacher: Teacher;
  viewMode?: 'grid' | 'list';
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, viewMode = 'grid' }) => {
  const getLocationIcon = (location: string) => {
    switch(location) {
      case 'En ligne': return <Globe className="w-3 h-3" />;
      case 'À domicile': return <Home className="w-3 h-3" />;
      case 'Chez l\'enseignant': return <User className="w-3 h-3" />;
      default: return <MapPin className="w-3 h-3" />;
    }
  };

  const renderGridMode = () => (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xs hover:shadow-xs transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="p-5">
        {/* Header avec avatar et info basique */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={teacher.profilePicture || getDefaultAvatar(teacher.firstName, teacher.lastName)}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getDefaultAvatar(teacher.firstName, teacher.lastName);
              }}
            />
            {teacher.rating >= 4.5 && (
              <div className="absolute -bottom-1 -right-1 bg-green-600 text-white p-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <GraduationCap className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                {teacher.subject.split(' - ')[0]}
              </span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(teacher.rating || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {teacher.rating ? `(${teacher.rating.toFixed(1)})` : 'Nouveau'}
              </span>
              {teacher.reviews && teacher.reviews.length > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  • {teacher.reviews.length} avis
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lieux</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {teacher.teachingLocations && teacher.teachingLocations.length > 0 ? (
              teacher.teachingLocations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                >
                  {getLocationIcon(location)}
                  <span>{location}</span>
                </div>
              ))
            ) : (
              <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                Non spécifié
              </span>
            )}
          </div>
        </div>

        {/* Skills (preview) */}
        {teacher.skills && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compétences</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {teacher.skills.split(',').slice(0, 3).join(', ')}...
            </p>
          </div>
        )}

        {/* Footer avec prix et bouton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Tarif horaire</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatHourlyRate(teacher.hourlyRate)}
              {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/h</span> */}
            </div>
          </div>
          <Link
            to={`/teachers/${teacher.id}`}
            className="px-4 py-2.5 bg-gray-100 hover:from-orange-600 hover:to-orange-700 text-gray font-medium rounded-lg transition-all duration-200 rounded-3xl text-xs"
          >
            Voir profil
          </Link>
        </div>
      </div>
    </div>
  );

  const renderListMode = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={teacher.profilePicture || getDefaultAvatar(teacher.firstName, teacher.lastName)}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="w-20 h-20 rounded-xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getDefaultAvatar(teacher.firstName, teacher.lastName);
              }}
            />
            {teacher.rating >= 4.5 && (
              <div className="absolute -bottom-2 -right-2 bg-green text-white p-1.5 rounded-full shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 px-3 py-1 rounded-full">
                    <GraduationCap className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {teacher.subject.split(' - ')[0]}
                    </span>
                  </div>
                </div>

                {/* Rating et reviews */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(teacher.rating || 0)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {teacher.rating?.toFixed(1) || 'Nouveau'}
                    </span>
                  </div>
                  {teacher.reviews && teacher.reviews.length > 0 && (
                    <span className="text-gray-600 dark:text-gray-400">
                      {teacher.reviews.length} avis
                    </span>
                  )}
                </div>

                {/* Skills et bio */}
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {teacher.skills.split(',').slice(0, 5).join(', ')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-3">
                    {teacher.bio}
                  </p>
                </div>

                {/* Locations */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Disponible :</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {teacher.teachingLocations && teacher.teachingLocations.length > 0 ? (
                      teacher.teachingLocations.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        >
                          {getLocationIcon(location)}
                          <span>{location}</span>
                        </div>
                      ))
                    ) : (
                      <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                        Non spécifié
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Price and Action */}
              <div className="flex flex-col items-end gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Tarif horaire</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatHourlyRate(teacher.hourlyRate)}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/h</span>
                  </div>
                </div>
                <Link
                  to={`/teachers/${teacher.id}`}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Réserver un cours
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return viewMode === 'grid' ? renderGridMode() : renderListMode();
};

export default TeacherCard;