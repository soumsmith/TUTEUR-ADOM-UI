import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import teacherService from '../services/teacherService';
import courseService from '../services/courseService';
import requestService from '../services/requestService';
import type { Teacher, Course, Review } from '../types';
import { formatHourlyRate } from '../utils/currency';

// Fonction pour générer une image d'avatar par défaut
const getDefaultAvatar = (firstName: string, lastName: string) => {
  const seed = `${firstName}-${lastName}`.toLowerCase();
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
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

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p>{error || 'Enseignant non trouvé'}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 btn-secondary"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* En-tête du profil */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="md:mr-6 mb-4 md:mb-0">
              <img
                src={teacher.profilePicture || getDefaultAvatar(teacher.firstName, teacher.lastName)}
                alt={`${teacher.firstName} ${teacher.lastName}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getDefaultAvatar(teacher.firstName, teacher.lastName);
                }}
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">
                {teacher.firstName} {teacher.lastName}
              </h1>
              
              <p className="text-xl mb-2">{teacher.subject}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                {teacher.teachingLocations && teacher.teachingLocations.length > 0 ? (
                  teacher.teachingLocations.map((location, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-700 rounded-full text-sm">
                      {location}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 bg-gray-500 rounded-full text-sm">
                    Lieux non spécifiés
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-center md:justify-start mb-2">
                <span className="text-yellow-300 mr-1">
                  {teacher.rating ? '★'.repeat(Math.floor(teacher.rating)) + (teacher.rating % 1 >= 0.5 ? '½' : '') : ''}
                </span>
                <span>
                  {teacher.rating 
                    ? `${teacher.rating.toFixed(1)} (${teacher.reviews?.length || 0} avis)` 
                    : 'Nouvel enseignant'}
                </span>
              </div>
              
              <p className="font-bold text-xl">{formatHourlyRate(teacher.hourlyRate)}</p>
            </div>
          </div>
        </div>
        
        {/* Contenu du profil */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne de gauche */}
            <div className="md:col-span-2">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">À propos de moi</h2>
                <p className="text-gray-700 whitespace-pre-line">{teacher.bio}</p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Compétences</h2>
                <p className="text-gray-700 whitespace-pre-line">{teacher.skills}</p>
              </section>

              {teacher.cv && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">CV</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <a
                      href={teacher.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                        <path d="M12 2.586V6a1 1 0 001 1h3.414L12 2.586z" />
                      </svg>
                      Voir le CV
                    </a>
                  </div>
                </section>
              )}
              
              {teacher.reviews && teacher.reviews.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Avis des parents</h2>
                  <div className="space-y-4">
                    {teacher.reviews && teacher.reviews.length > 0 ? teacher.reviews.map((review: Review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Anonyme</span>
                            <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-4">Aucun avis pour le moment</p>
                    )}
                  </div>
                </section>
              )}
            </div>
            
            {/* Colonne de droite */}
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Mes cours</h3>
                {courses.length === 0 ? (
                  <p className="text-gray-600">Aucun cours disponible pour le moment</p>
                ) : (
                  <div className="space-y-3">
                    {courses.map(course => (
                      <div key={course.id} className="bg-white p-3 rounded border">
                        <h4 className="font-medium">{course.subject}</h4>
                        <p className="text-sm text-gray-600 mb-1">{course.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{formatHourlyRate(course.hourlyRate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Formulaire de demande de cours */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Demander un cours</h3>
                
                {requestSent ? (
                  <div className="bg-green-100 text-green-700 p-3 rounded mb-3">
                    Votre demande a été envoyée avec succès ! Un administrateur vous contactera bientôt.
                  </div>
                ) : (
                  <>
                    {requestError && (
                      <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
                        {requestError}
                      </div>
                    )}
                    
                    <form onSubmit={handleRequestCourse}>
                      <div className="mb-3">
                        <label htmlFor="course" className="block text-gray-700 text-sm font-medium mb-1">
                          Sélectionnez un cours
                        </label>
                        <select
                          id="course"
                          className="input-field"
                          value={selectedCourse}
                          onChange={(e) => setSelectedCourse(e.target.value)}
                          required
                        >
                          <option value="">Choisir un cours</option>
                          {courses.map(course => (
                            <option key={course.id} value={course.id}>
                              {course.subject} - {formatHourlyRate(course.hourlyRate)}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-1">
                          Message à l'enseignant
                        </label>
                        <textarea
                          id="message"
                          className="input-field h-24 resize-none"
                          placeholder="Présentez-vous et expliquez votre besoin..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={!isAuthenticated || user?.role !== 'parent'}
                      >
                        {!isAuthenticated 
                          ? 'Connectez-vous pour demander un cours' 
                          : user?.role !== 'parent' 
                            ? 'Seuls les parents peuvent demander des cours'
                            : 'Envoyer ma demande'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage; 