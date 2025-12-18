import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import teacherService from '../services/teacherService';
import courseService from '../services/courseService';
import requestService from '../services/requestService';
import type { Teacher, Course, Review } from '../types';
import { formatHourlyRate } from '../utils/currency';
import {
  Calendar,
  MapPin,
  Star,
  GraduationCap,
  Clock,
  MessageCircle,
  Award,
  BookOpen,
  Download,
  ArrowLeft,
  CheckCircle,
  Globe,
  Home,
  User,
  Mail,
  FileText,
  Award as Trophy,
  Users,
  ChevronRight,
  Shield,
  Heart,
  Share2,
  Book,
  Target,
  Check
} from 'lucide-react';

// Fonction pour générer une image d'avatar par défaut
const getDefaultAvatar = (firstName: string, lastName: string) => {
  const seed = `${firstName}-${lastName}`.toLowerCase();
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

const TeacherProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [message, setMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const teacherData = await teacherService.getTeacherById(id);
        setTeacher(teacherData);

        const coursesData = await courseService.getCoursesByTeacher(id);
        setCourses(coursesData);

        setError(null);
      } catch (err) {
        setError('Impossible de charger les informations de l\'enseignant.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [id]);

  const handleRequestCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/teachers/${id}` } });
      return;
    }

    if (!selectedCourse) {
      setRequestError('Veuillez sélectionner un cours');
      return;
    }

    if (!message) {
      setRequestError('Veuillez entrer un message pour l\'enseignant');
      return;
    }

    if (!user || user.role !== 'parent') {
      setRequestError('Seuls les parents peuvent demander des cours');
      return;
    }

    try {
      await requestService.createRequest(user.id, {
        teacherId: id as string,
        courseId: selectedCourse,
        message,
      });

      setRequestSent(true);
      setRequestError(null);
      setSelectedCourse('');
      setMessage('');
    } catch (err) {
      setRequestError('Échec de l\'envoi de la demande. Veuillez réessayer.');
      console.error(err);
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'En ligne': return <Globe className="w-4 h-4" />;
      case 'À domicile': return <Home className="w-4 h-4" />;
      case 'Chez l\'enseignant': return <User className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">
            Chargement du profil...
          </p>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Erreur</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Enseignant non trouvé'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow dark:shadow-gray-900/50"
          >
            <ArrowLeft className="inline-block w-4 h-4 mr-2" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Bouton retour */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux résultats
        </button>
      </div>

      {/* Header du profil */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="relative">
                  <img
                    src={teacher.profilePicture || getDefaultAvatar(teacher.firstName, teacher.lastName)}
                    alt={`${teacher.firstName} ${teacher.lastName}`}
                    className="w-40 h-40 rounded-xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getDefaultAvatar(teacher.firstName, teacher.lastName);
                    }}
                  />
                  {teacher.rating >= 4.5 && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 dark:bg-amber-600 text-white p-2 rounded-full shadow-lg">
                      <Award className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-lg ${isFavorite
                      ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
                      : 'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Informations principales */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {teacher.firstName} {teacher.lastName}
                  </h1>

                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                      <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-700 dark:text-blue-300 font-medium">{teacher.subject.split(' - ')[0]}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-full">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(teacher.rating || 0)
                                ? 'fill-amber-400 dark:fill-amber-500 text-amber-400 dark:text-amber-500'
                                : 'fill-gray-300 dark:fill-gray-600 text-gray-300 dark:text-gray-600'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-amber-700 dark:text-amber-300 font-medium">{teacher.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Lieux d'enseignement */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Disponible pour :</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {teacher.teachingLocations && teacher.teachingLocations.length > 0 ? (
                      teacher.teachingLocations.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {getLocationIcon(location)}
                          <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{location}</span>
                        </div>
                      ))
                    ) : (
                      <span className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm">
                        Lieux non spécifiés
                      </span>
                    )}
                  </div>
                </div>

                {/* Prix et action principale */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                  <div className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800 px-6 py-3 rounded-lg shadow-sm">
                    <div className="text-sm text-emerald-600 dark:text-emerald-400">Tarif horaire</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatHourlyRate(teacher.hourlyRate)}
                      {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/h</span> */}
                    </div>
                  </div>
                  <div className='border-emerald-200 dark:border-emerald-800'></div>

                  <button
                    onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-6  font-semibold rounded-lg transition-all duration-200 bg-gray-100 transform hover:-translate-y-0.5 flex items-center gap-2 "
                  >
                    <Calendar className="w-5 h-5" />
                    Réserver un cours
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Informations détaillées */}
          <div className="lg:col-span-2 space-y-8">
            {/* À propos */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl order border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">À propos de moi</h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {teacher.bio}
                </p>
              </div>
            </div>

            {/* Compétences */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Compétences & Expertise</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {teacher.skills.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Avis */}
            {teacher.reviews && teacher.reviews.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                      <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Avis des parents</h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {teacher.reviews.length} avis • Note moyenne : {teacher.rating?.toFixed(1)}/5
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {teacher.reviews.map((review: Review) => (
                    <div key={review.id} className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                              {review.parentId?.charAt(0).toUpperCase() || 'P'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              Parent {review.parentId?.slice(-4) || 'Anonyme'}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating
                                        ? 'fill-amber-400 dark:fill-amber-500 text-amber-400 dark:text-amber-500'
                                        : 'fill-gray-300 dark:fill-gray-600 text-gray-300 dark:text-gray-600'
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite - Booking & Cours */}
          <div className="space-y-8">
            {/* Booking Form */}
            <div id="booking-form" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 sticky top-8">
              <div className="flex items-center gap-3 mb-6 bg-blue-50 dark:bg-blue-900/30">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold ">Réserver un cours</h3>
              </div>

              {requestSent ? (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-lg text-center">
                  <CheckCircle className="w-16 h-16 text-emerald-500 dark:text-emerald-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Demande envoyée !
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Votre demande a été envoyée avec succès. {teacher.firstName} vous contactera bientôt.
                  </p>
                  <button
                    onClick={() => setRequestSent(false)}
                    className="px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    Faire une autre demande
                  </button>
                </div>
              ) : (
                <>
                  {requestError && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-sm text-red-700 dark:text-red-300">{requestError}</div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleRequestCourse} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sélectionner un cours
                      </label>
                      <div className="space-y-3">
                        {courses.map(course => (
                          <label
                            key={course.id}
                            className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedCourse === course.id
                                ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-600'
                                : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                              }`}
                          >
                            <input
                              type="radio"
                              name="course"
                              value={course.id}
                              checked={selectedCourse === course.id}
                              onChange={(e) => setSelectedCourse(e.target.value)}
                              className="mt-1 text-blue-500 dark:text-blue-400"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {course.subject}
                                </h4>
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                  {formatHourlyRate(course.hourlyRate)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                {course.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>1h par session</span>
                                {course.locations && course.locations[0] && (
                                  <>
                                    <span>•</span>
                                    {getLocationIcon(course.locations[0])}
                                    <span>{course.locations[0]}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                        {courses.length === 0 && (
                          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Aucun cours disponible pour le moment</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Votre message
                      </label>
                      <textarea
                        id="message"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 focus:border-transparent transition-all duration-200 resize-none h-32"
                        placeholder="Présentez-vous et expliquez votre besoin..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!isAuthenticated || user?.role !== 'parent' || courses.length === 0}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${!isAuthenticated || user?.role !== 'parent' || courses.length === 0
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white shadow-sm hover:shadow transform hover:-translate-y-0.5'
                        }`}
                    >
                      {!isAuthenticated
                        ? 'Connectez-vous pour réserver'
                        : user?.role !== 'parent'
                          ? 'Réservé aux parents'
                          : courses.length === 0
                            ? 'Aucun cours disponible'
                            : 'Envoyer ma demande'
                      }
                    </button>

                    {/* Avantages */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Pourquoi réserver avec nous</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-green-500 dark:text-green-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Paiement sécurisé</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction garantie</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MessageCircle className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Réponse rapide</span>
                        </div>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* CV et Contact */}
            {(teacher.cvUrl || teacher.email) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents & Contact</h4>
                <div className="space-y-3">
                  {teacher.cvUrl && (
                    <a
                      href={teacher.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded-lg group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-blue-700 dark:text-blue-300">Voir le CV</span>
                      </div>
                      <Download className="w-4 h-4 text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </a>
                  )}

                  {teacher.email && (
                    <a
                      href={`mailto:${teacher.email}`}
                      className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-800/30 rounded-lg group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg">
                          <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium text-emerald-700 dark:text-emerald-300">Contacter par email</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Stats détaillées */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistiques</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Expérience</div>
                      <div className="font-semibold text-gray-900 dark:text-white">10+ ans</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                      <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Taux de réussite</div>
                      <div className="font-semibold text-gray-900 dark:text-white">95%</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                      <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Élèves suivis</div>
                      <div className="font-semibold text-gray-900 dark:text-white">200+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;