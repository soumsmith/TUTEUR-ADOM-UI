import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../redux/store';
import requestService from '../services/requestService';
import courseService from '../services/courseService';
import teacherService from '../services/teacherService';
import type { Request, Course, Appointment, Teacher } from '../types';
import AddCourseForm from '../components/courses/AddCourseForm';
import EditCourseForm from '../components/courses/EditCourseForm';
import EditProfileForm from '../components/teachers/EditProfileForm';
import { useAdminDetails } from '../hooks/useAdminDetails';
import { formatHourlyRate } from '../utils/currency';

const TeacherDashboardPage = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState<Request[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [cvSuccess, setCvSuccess] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showEditCourseForm, setShowEditCourseForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  
  // Vérifier si l'utilisateur est authentifié et est un enseignant
  if (!isAuthenticated || !user || user.role !== 'teacher') {
    return <Navigate to="/login" />;
  }

  // Recharger les données utilisateur complètes au chargement du dashboard
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const updatedTeacher = await teacherService.getTeacherById(user.id);
        setCurrentUser(updatedTeacher);
      } catch (err) {
        console.error('Erreur lors du rechargement du profil utilisateur:', err);
      }
    };

    loadUserProfile();
  }, [user.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'requests') {
          const requestsData = await requestService.getRequestsByTeacher(user.id);
          setRequests(requestsData);
        } else if (activeTab === 'appointments') {
          const appointmentsData = await requestService.getAppointmentsByTeacher(user.id);
          setAppointments(appointmentsData);
        } else if (activeTab === 'courses') {
          try {
            const coursesData = await courseService.getCoursesByTeacher(user.id);
            setCourses(coursesData);
          } catch (courseError) {
            console.warn('API courses non disponible, affichage message approprié:', courseError);
            setCourses([]); // Tableau vide au lieu d'erreur
            setError(null); // Pas d'erreur globale
          }
        }
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user.id]);

  const handleAddCourseSuccess = async () => {
    try {
      const updatedCourses = await courseService.getCoursesByTeacher(user.id);
      setCourses(updatedCourses);
      setShowAddCourseForm(false);
    } catch (err) {
      console.warn('Impossible de recharger les cours depuis l\'API:', err);
      // Fermer le formulaire même si le rechargement échoue
      setShowAddCourseForm(false);
      // Ne pas afficher d'erreur bloquante
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">En attente</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Approuvée</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Refusée</span>;
      case 'scheduled':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Planifié</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Terminé</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Annulé</span>;
      default:
        return null;
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    
    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Le fichier est trop volumineux. Taille maximale : 5MB');
      return;
    }
    
    // Vérifier le type de fichier
    if (!file.type.includes('pdf')) {
      setError('Seuls les fichiers PDF sont acceptés');
      return;
    }

    try {
      setUploadingCV(true);
      setError(null);
      
      const cvUrl = await teacherService.uploadCV(user.id, file);
      
      // Mettre à jour l'utilisateur local avec le nouveau CV
      const updatedUser = { ...user, cv: cvUrl };
      setCurrentUser(updatedUser);
      setCvSuccess('CV téléchargé avec succès !');
      setError(null);
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setCvSuccess(null), 3000);
    } catch (err) {
      setError('Erreur lors du téléchargement du CV. Veuillez réessayer.');
      console.error(err);
    } finally {
      setUploadingCV(false);
    }
  };

  const handleDeleteCV = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre CV ?')) return;

    try {
      setError(null);
      await teacherService.updateTeacherProfile(user.id, { cv: undefined });
      
      // Mettre à jour l'utilisateur local
      const updatedUser = { ...user, cv: undefined };
      setCurrentUser(updatedUser);
      setCvSuccess('CV supprimé avec succès !');
      setError(null);
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setCvSuccess(null), 3000);
    } catch (err) {
      setError('Erreur lors de la suppression du CV. Veuillez réessayer.');
      console.error(err);
    }
  };

  const handleEditProfileSuccess = () => {
    setShowEditProfileForm(false);
    setProfileSuccess('Profil mis à jour avec succès !');
    
    // Recharger les données utilisateur
    const reloadUserData = async () => {
      try {
        const updatedTeacher = await teacherService.getTeacherById(user.id);
        setCurrentUser(updatedTeacher);
      } catch (err) {
        console.error('Erreur lors du rechargement des données:', err);
      }
    };
    
    reloadUserData();
    
    // Effacer le message de succès après 3 secondes
    setTimeout(() => setProfileSuccess(null), 3000);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowEditCourseForm(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;

    try {
      setError(null);
      await courseService.deleteCourse(courseId);
      
      // Recharger la liste des cours
      const coursesData = await courseService.getCoursesByTeacher(user.id);
      setCourses(coursesData);
      
      // Afficher un message de succès temporaire
      const tempSuccess = document.createElement('div');
      tempSuccess.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      tempSuccess.textContent = 'Cours supprimé avec succès !';
      document.body.appendChild(tempSuccess);
      setTimeout(() => {
        document.body.removeChild(tempSuccess);
      }, 3000);
      
    } catch (err) {
      setError('Erreur lors de la suppression du cours. Veuillez réessayer.');
      console.error(err);
    }
  };

  const handleEditCourseSuccess = () => {
    setShowEditCourseForm(false);
    setEditingCourse(null);
    
    // Recharger la liste des cours
    const reloadCourses = async () => {
      try {
        const coursesData = await courseService.getCoursesByTeacher(user.id);
        setCourses(coursesData);
      } catch (err) {
        console.error('Erreur lors du rechargement des cours:', err);
      }
    };
    
    reloadCourses();
    
    // Afficher un message de succès temporaire
    const tempSuccess = document.createElement('div');
    tempSuccess.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
    tempSuccess.textContent = 'Cours modifié avec succès !';
    document.body.appendChild(tempSuccess);
    setTimeout(() => {
      document.body.removeChild(tempSuccess);
    }, 3000);
  };

  const handleShowRequestDetails = (request: Request) => {
    setSelectedRequest(request);
    setShowRequestDetailsModal(true);
  };

  const handleCloseRequestDetails = () => {
    setSelectedRequest(null);
    setShowRequestDetailsModal(false);
  };

  // Composant pour la modal de détails avec les vraies informations
  const RequestDetailsModal = ({ request, onClose }: { request: Request; onClose: () => void }) => {
    const { parent, teacher, course, loading } = useAdminDetails(request.parentId, request.teacherId, request.courseId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Détails de la demande</h3>
            
            <div className="space-y-3">
              <p><strong>ID de la demande:</strong> #{request.id.slice(0, 8)}</p>
              
              <div>
                <strong>Parent:</strong> {loading ? (
                  <span className="text-gray-500 ml-2">Chargement...</span>
                ) : parent ? (
                  <span className="ml-2">{parent.firstName} {parent.lastName} ({parent.email})</span>
                ) : (
                  <span className="text-red-500 ml-2">Parent non trouvé</span>
                )}
              </div>

              <div>
                <strong>Enseignant:</strong> {loading ? (
                  <span className="text-gray-500 ml-2">Chargement...</span>
                ) : teacher ? (
                  <span className="ml-2">{teacher.firstName} {teacher.lastName} - {teacher.subject}</span>
                ) : (
                  <span className="text-red-500 ml-2">Enseignant non trouvé</span>
                )}
              </div>

              <div>
                <strong>Cours demandé:</strong> {loading ? (
                  <span className="text-gray-500 ml-2">Chargement...</span>
                ) : course ? (
                  <div className="ml-2">
                    <div>{course.subject}</div>
                    <div className="text-sm text-gray-600">{course.description}</div>
                    <div className="text-sm font-medium">{course.hourlyRate} FCFA/h</div>
                  </div>
                ) : (
                  <span className="text-red-500 ml-2">Cours non trouvé</span>
                )}
              </div>

              <div>
                <strong>Message:</strong>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {request.message}
                </div>
              </div>

              <p><strong>Date de création:</strong> {new Date(request.createdAt).toLocaleDateString('fr-FR')}</p>
              
              <div>
                <strong>Statut:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status === 'pending' ? 'En attente' : 
                   request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                </span>
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="mt-6 flex space-x-3">
                <button 
                  onClick={() => {
                    // TODO: Implement logic to approve the request
                    console.log('Approve request:', request.id);
                    onClose();
                  }}
                  className="btn-primary"
                >
                  Approuver
                </button>
                <button 
                  onClick={() => {
                    // TODO: Implement logic to reject the request
                    console.log('Reject request:', request.id);
                    onClose();
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Rejeter
                </button>
              </div>
            )}
            
            <button 
              onClick={onClose}
              className="mt-4 btn-secondary"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Composant pour une ligne de demande avec les vraies informations
  const RequestRow = ({ request }: { request: Request }) => {
    const { parent, teacher, course, loading } = useAdminDetails(request.parentId, request.teacherId, request.courseId);

    return (
      <tr key={request.id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          #{request.id.slice(0, 8)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {loading ? (
            <span className="text-gray-500">Chargement...</span>
          ) : parent ? (
            <div>
              <div className="font-medium">{parent.firstName} {parent.lastName}</div>
              <div className="text-gray-500">{parent.email}</div>
            </div>
          ) : (
            <span className="text-red-500">Parent non trouvé</span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {loading ? (
            <span className="text-gray-500">Chargement...</span>
          ) : course ? (
            <div>
              <div className="font-medium">{course.subject}</div>
              <div className="text-gray-500">{course.hourlyRate} FCFA/h</div>
            </div>
          ) : (
            <span className="text-red-500">Cours non trouvé</span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="max-w-xs truncate">
            {request.message}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {new Date(request.createdAt).toLocaleDateString('fr-FR')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            request.status === 'approved' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {request.status === 'pending' ? 'En attente' : 
             request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <button 
            onClick={() => handleShowRequestDetails(request)}
            className="text-blue-600 hover:text-blue-900"
          >
            Voir détails
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord enseignant</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos demandes, rendez-vous et cours
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Demandes
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rendez-vous
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes cours
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mon profil
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {cvSuccess && (
            <div className="p-4 mb-6 bg-green-100 text-green-700 rounded-md">
              {cvSuccess}
            </div>
          )}
          
          {profileSuccess && (
            <div className="p-4 mb-6 bg-green-100 text-green-700 rounded-md">
              {profileSuccess}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Onglet Demandes */}
              {activeTab === 'requests' && (
                <>
                  {requests.length === 0 ? (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande en attente</h3>
                      <p className="text-gray-600">
                        Vous n'avez pas de nouvelles demandes de cours pour le moment.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Parent
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cours
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Message
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {requests.map(request => (
                            <RequestRow key={request.id} request={request} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
              
              {/* Onglet Rendez-vous */}
              {activeTab === 'appointments' && (
                <>
                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous programmé</h3>
                      <p className="text-gray-600">
                        Vous n'avez pas de rendez-vous à venir pour le moment.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Horaire
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Parent
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Lieu
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {appointments.map(appointment => (
                            <tr key={appointment.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{appointment.date}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{appointment.startTime} - {appointment.endTime}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">ID: {appointment.parentId.slice(0, 8)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{appointment.location}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  appointment.status === 'scheduled'
                                    ? 'bg-blue-100 text-blue-800'
                                    : appointment.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {appointment.status === 'scheduled' ? 'Programmé' : appointment.status === 'completed' ? 'Terminé' : 'Annulé'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
              
              {/* Onglet Mes cours */}
              {activeTab === 'courses' && (
                <>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setShowAddCourseForm(true)}
                      className="btn-primary mr-2"
                    >
                      Ajouter un cours
                    </button>
                    <button
                      onClick={() => {
                        const storedCourses = localStorage.getItem('tuteur-adom-courses');
                        console.log('Cours stockés:', JSON.parse(storedCourses || '[]'));
                        alert(`Nombre de cours: ${courses.length}\nDétails dans la console (F12)`);
                      }}
                      className="btn-secondary"
                    >
                      Debug
                    </button>
                  </div>
                  
                  {showAddCourseForm ? (
                    <AddCourseForm
                      teacherId={user.id}
                      onSuccess={handleAddCourseSuccess}
                      onCancel={() => setShowAddCourseForm(false)}
                    />
                  ) : courses.length === 0 ? (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours créé</h3>
                      <p className="text-gray-600">
                        Créez des cours pour que les parents puissent les voir et faire des demandes.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.map(course => (
                        <div key={course.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h3 className="font-semibold text-lg mb-2 text-gray-900">{course.subject}</h3>
                          <p className="text-gray-700 mb-3 text-sm leading-relaxed">{course.description}</p>
                          
                          {/* Lieux d'enseignement */}
                          <div className="mb-3">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lieux d'enseignement :</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {course.locations?.map((location, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {location}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Date de création */}
                          <div className="mb-3">
                            <span className="text-xs text-gray-500">
                              Créé le {new Date(course.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="font-bold text-lg text-green-600">{formatHourlyRate(course.hourlyRate)}</span>
                            <div className="space-x-2">
                              <button 
                                onClick={() => handleEditCourse(course)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Modifier
                              </button>
                              <button 
                                onClick={() => handleDeleteCourse(course.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {/* Onglet Profil */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl mx-auto">
                  <div className="mb-4 text-center">
                    <div className="inline-block h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                      <div className="flex items-center justify-center h-full w-full bg-blue-500 text-white text-2xl font-bold">
                        {currentUser?.firstName.charAt(0)}{currentUser?.lastName.charAt(0)}
                      </div>
                    </div>
                    <h2 className="mt-4 text-xl font-bold">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </h2>
                    <p className="text-gray-600">{currentUser?.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="font-semibold mb-4">CV</h3>
                    {(currentUser as Teacher)?.cv ? (
                      <div className="flex items-center justify-between">
                        <a
                          href={(currentUser as Teacher).cv}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                            <path d="M12 2.586V6a1 1 0 001 1h3.414L12 2.586z" />
                          </svg>
                          Voir mon CV
                        </a>
                        <button
                          onClick={handleDeleteCV}
                          className="text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 mb-4">
                          Ajoutez votre CV pour augmenter vos chances d'être sélectionné par les parents.
                        </p>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleCVUpload}
                          disabled={uploadingCV}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {uploadingCV && (
                          <div className="mt-2 text-sm text-blue-600">
                            Téléchargement en cours...
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="font-semibold mb-4">Informations du profil</h3>
                    
                    <div className="mt-4">
                      <button 
                        onClick={() => setShowEditProfileForm(true)}
                        className="btn-primary w-full md:w-auto"
                      >
                        Modifier mon profil
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Formulaire de modification de profil */}
              {showEditProfileForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <EditProfileForm
                      teacher={currentUser as Teacher}
                      onSuccess={handleEditProfileSuccess}
                      onCancel={() => setShowEditProfileForm(false)}
                    />
                  </div>
                </div>
              )}

              {/* Formulaire de modification de cours */}
              {showEditCourseForm && editingCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <EditCourseForm
                      course={editingCourse}
                      onSuccess={handleEditCourseSuccess}
                      onCancel={() => {
                        setShowEditCourseForm(false);
                        setEditingCourse(null);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Modal de détails de la demande */}
              {showRequestDetailsModal && selectedRequest && (
                <RequestDetailsModal
                  request={selectedRequest}
                  onClose={handleCloseRequestDetails}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage; 