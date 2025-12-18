import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TeacherCard from './TeacherCard';
import teacherService from '../../services/teacherService';
import { TeachingLocation } from '../../types';
import type { Teacher } from '../../types';
import {
  Search,
  Filter,
  X,
  Grid,
  List,
  Users,
  Star,
  DollarSign,
  BookOpen,
  RefreshCw
} from 'lucide-react';

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        console.log("Chargement des enseignants...");
        const response = await teacherService.getAllTeachers({
          subject: filters.subject,
          minHourlyRate: filters.minRate ? Number(filters.minRate) : undefined,
          maxHourlyRate: filters.maxRate ? Number(filters.maxRate) : undefined,
          location: filters.location,
        });
        console.log("Enseignants reçus:", response);
        setTeachers(response);
        setError(null);
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

  // Stats calculées
  const stats = {
    total: teachers.length,
    averageRate: teachers.length > 0
      ? Math.round(teachers.reduce((sum, t) => sum + t.hourlyRate, 0) / teachers.length)
      : 0,
    averageRating: teachers.length > 0
      ? (teachers.reduce((sum, t) => sum + (t.rating || 0), 0) / teachers.length).toFixed(1)
      : '0.0',
    availableSubjects: new Set(teachers.map(t => t.subject.split(' - ')[0])).size
  };

  // Compter les filtres actifs
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className="min-h-screen dark:from-gray-900 dark:to-gray-800">
      {/* Header avec stats */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-3xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Trouvez le professeur idéal
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Des experts qualifiés pour vous accompagner dans votre réussite
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Professeurs</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                  <Star className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.averageRating}
                    <span className="text-lg text-gray-600 dark:text-gray-400">/5</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Note moyenne</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                  <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.averageRate.toLocaleString()} FCFA
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tarif moyen</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.availableSubjects}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Matières</div>
                </div>
              </div>
            </div>
          </div>

          {/* Barre de recherche principale */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                name="search"
                placeholder="Rechercher un professeur, une matière, une compétence..."
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 transition-all duration-200"
                value={filters.search}
                onChange={handleFilterChange}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gray-100 font-medium rounded-lg transition-all duration-200 "
              >
                Rechercher
              </button>
            </div>
          </form>

          {/* Filtres originaux */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Filtrer les résultats</h2>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full">
                    {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg shadow-md"
              >
                <Filter className="w-4 h-4" />
                Filtres
              </button>

              <div className="hidden lg:flex items-center gap-4">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Réinitialiser
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    aria-label="Affichage en grille"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'list'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    aria-label="Affichage en liste"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Matière
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
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
                <label htmlFor="minRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tarif min (FCFA/h)
                </label>
                <input
                  type="number"
                  id="minRate"
                  name="minRate"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Minimum"
                  min="0"
                  value={filters.minRate}
                  onChange={handleFilterChange}
                />
              </div>

              <div>
                <label htmlFor="maxRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tarif max (FCFA/h)
                </label>
                <input
                  type="number"
                  id="maxRate"
                  name="maxRate"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Maximum"
                  min="0"
                  value={filters.maxRate}
                  onChange={handleFilterChange}
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lieu de formation
                </label>
                <select
                  id="location"
                  name="location"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
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

            {/* Filtres actifs (badges) */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtres appliqués :</span>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 font-medium"
                  >
                    Tout effacer
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.subject && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      Matière: {filters.subject}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, subject: '' }))}
                        className="ml-1 hover:text-blue-900 dark:hover:text-blue-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.minRate && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm">
                      Min: {filters.minRate} FCFA
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, minRate: '' }))}
                        className="ml-1 hover:text-amber-900 dark:hover:text-amber-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.maxRate && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
                      Max: {filters.maxRate} FCFA
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, maxRate: '' }))}
                        className="ml-1 hover:text-emerald-900 dark:hover:text-emerald-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.location && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      Lieu: {filters.location}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                        className="ml-1 hover:text-purple-900 dark:hover:text-purple-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      Recherche: {filters.search}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                        className="ml-1 hover:text-gray-900 dark:hover:text-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* En-tête résultats (mobile) */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {loading ? 'Chargement...' : `${filteredTeachers.length} résultat${filteredTeachers.length > 1 ? 's' : ''}`}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg ${viewMode === 'grid'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              aria-label="Affichage en grille"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg ${viewMode === 'list'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              aria-label="Affichage en liste"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* En-tête résultats (desktop) */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {loading ? 'Chargement...' : `${filteredTeachers.length} professeur${filteredTeachers.length > 1 ? 's' : ''} disponible${filteredTeachers.length > 1 ? 's' : ''}`}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300">Erreur</h3>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">
              Recherche des meilleurs professeurs...
            </p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Aucun professeur trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Essayez de modifier vos critères de recherche ou élargissez vos filtres pour découvrir plus d'options
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Réinitialiser les filtres
            </button>

            {teachers.length > 0 && (
              <div className="mt-8 p-4 bg-gray-100 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">{teachers.length} professeurs</span> sont disponibles mais filtrés par vos critères actuels.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Liste des professeurs */}
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-6"
            }>
              {filteredTeachers.map(teacher => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination suggérée */}
            {filteredTeachers.length > 12 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 dark:text-gray-400">
                    Affichage de 1 à 12 sur {filteredTeachers.length} résultats
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Précédent
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md">
                      1
                    </button>
                    <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      2
                    </button>
                    <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filtres mobiles (modal) */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Filtres
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Filtres mobiles (copie des filtres originaux) */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="subject-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Matière
                  </label>
                  <select
                    id="subject-mobile"
                    name="subject"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
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
                  <label htmlFor="minRate-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tarif minimum
                  </label>
                  <input
                    type="number"
                    id="minRate-mobile"
                    name="minRate"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                    placeholder="Minimum FCFA/h"
                    min="0"
                    value={filters.minRate}
                    onChange={handleFilterChange}
                  />
                </div>

                <div>
                  <label htmlFor="maxRate-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tarif maximum
                  </label>
                  <input
                    type="number"
                    id="maxRate-mobile"
                    name="maxRate"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                    placeholder="Maximum FCFA/h"
                    min="0"
                    value={filters.maxRate}
                    onChange={handleFilterChange}
                  />
                </div>

                <div>
                  <label htmlFor="location-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lieu de formation
                  </label>
                  <select
                    id="location-mobile"
                    name="location"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                    value={filters.location}
                    onChange={handleFilterChange}
                  >
                    <option value="">Tous les lieux</option>
                    <option value={TeachingLocation.ONLINE}>En ligne</option>
                    <option value={TeachingLocation.HOME}>À domicile</option>
                    <option value={TeachingLocation.TEACHER_PLACE}>Chez l'enseignant</option>
                  </select>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      resetFilters();
                      setShowMobileFilters(false);
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersList;