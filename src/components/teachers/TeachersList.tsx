import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TeacherCard from './TeacherCard';
import teacherService from '../../services/teacherService';
import { TeachingLocation } from '../../types';
import type { Teacher } from '../../types';

const subjects = [
  'Mathématiques',
  'Français',
  'Anglais',
  'Histoire',
  'Géographie',
  'Physique',
  'Chimie',
  'SVT',
  'Philosophie',
  'Économie',
  'Informatique',
  'Musique',
  'Arts'
];

const TeachersList = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filtres
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    subject: searchParams.get('subject') || '',
    minRate: searchParams.get('minRate') || '',
    maxRate: searchParams.get('maxRate') || '',
    location: searchParams.get('location') || '',
    search: searchParams.get('search') || '',
  });

  // Chargement initial des enseignants
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null); // Réinitialiser l'erreur à chaque nouvelle tentative
        console.log("Chargement des enseignants...");
        
        const response = await teacherService.getAllTeachers({
          subject: filters.subject,
          minHourlyRate: filters.minRate ? Number(filters.minRate) : undefined,
          maxHourlyRate: filters.maxRate ? Number(filters.maxRate) : undefined,
          location: filters.location,
        });
        
        console.log("Enseignants reçus:", response);
        setTeachers(response);
      } catch (err) {
        console.error("Erreur lors du chargement des enseignants:", err);
        setError('Impossible de charger les enseignants. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [filters.subject, filters.minRate, filters.maxRate, filters.location]);

  // Mise à jour des filtres et des paramètres d'URL
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  // Recherche par texte
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newParams = new URLSearchParams(searchParams);
    if (filters.search) {
      newParams.set('search', filters.search);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  // Filtrage local pour la recherche textuelle
  const filteredTeachers = teachers.filter(teacher => {
    if (!filters.search) return true;
    
    const searchLower = filters.search.toLowerCase();
    return (
      teacher.firstName.toLowerCase().includes(searchLower) ||
      teacher.lastName.toLowerCase().includes(searchLower) ||
      teacher.subject.toLowerCase().includes(searchLower) ||
      teacher.skills.toLowerCase().includes(searchLower)
    );
  });

  const resetFilters = () => {
    setFilters({
      subject: '',
      minRate: '',
      maxRate: '',
      location: '',
      search: '',
    });
    setSearchParams({});
  };

  // Affichage de débogage
  console.log("État actuel:", { 
    loading, 
    error, 
    teachersCount: teachers.length, 
    filteredCount: filteredTeachers.length,
    filters
  });

  const retryLoading = () => {
    // Fonction pour réessayer le chargement
    setLoading(true);
    setError(null);
    
    // Délai artificiel pour simuler une nouvelle tentative
    setTimeout(async () => {
      try {
        const response = await teacherService.getAllTeachers({
          subject: filters.subject,
          minHourlyRate: filters.minRate ? Number(filters.minRate) : undefined,
          maxHourlyRate: filters.maxRate ? Number(filters.maxRate) : undefined,
          location: filters.location,
        });
        
        setTeachers(response);
      } catch (err) {
        console.error("Erreur lors de la nouvelle tentative:", err);
        setError('Impossible de charger les enseignants. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div>
      <div className="bg-white p-4 mb-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rechercher un enseignant</h2>
        
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex">
            <input
              type="text"
              name="search"
              placeholder="Rechercher par nom, matière, compétences..."
              className="input-field flex-1 mr-2"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <button type="submit" className="btn-primary">
              Rechercher
            </button>
          </div>
        </form>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-1">
              Matière
            </label>
            <select
              id="subject"
              name="subject"
              className="input-field"
              value={filters.subject}
              onChange={handleFilterChange}
            >
              <option value="">Toutes les matières</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="minRate" className="block text-gray-700 text-sm font-medium mb-1">
              Tarif min (€/h)
            </label>
            <input
              type="number"
              id="minRate"
              name="minRate"
              className="input-field"
              placeholder="Min"
              min="0"
              value={filters.minRate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div>
            <label htmlFor="maxRate" className="block text-gray-700 text-sm font-medium mb-1">
              Tarif max (€/h)
            </label>
            <input
              type="number"
              id="maxRate"
              name="maxRate"
              className="input-field"
              placeholder="Max"
              min="0"
              value={filters.maxRate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-gray-700 text-sm font-medium mb-1">
              Lieu de formation
            </label>
            <select
              id="location"
              name="location"
              className="input-field"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">Tous les lieux</option>
              <option value={TeachingLocation.ONLINE}>{TeachingLocation.ONLINE}</option>
              <option value={TeachingLocation.HOME}>{TeachingLocation.HOME}</option>
              <option value={TeachingLocation.TEACHER_PLACE}>{TeachingLocation.TEACHER_PLACE}</option>
            </select>
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <button 
            onClick={resetFilters}
            className="text-orange hover:text-orange text-sm"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          {loading ? 'Chargement...' : `${filteredTeachers.length} enseignants disponibles`}
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-orange' : 'bg-gray-100'}`}
            aria-label="Affichage en grille"
          >
            Grille
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-orange' : 'bg-gray-100'}`}
            aria-label="Affichage en liste"
          >
            Liste
          </button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md flex flex-col items-center">
          <p className="mb-3">{error}</p>
          <button 
            onClick={retryLoading} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange"></div>
        </div>
      ) : filteredTeachers.length === 0 && !error ? (
        <div className="bg-white p-8 text-center rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun enseignant trouvé</h3>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          
          {/* Debug info */}
          {teachers.length > 0 && (
            <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-700 rounded">
              <p>Données disponibles mais filtrées. Essayez de réinitialiser les filtres.</p>
            </div>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "space-y-4"
        }>
          {filteredTeachers.map(teacher => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      )}
      
     
    </div>
  );
};

export default TeachersList; 