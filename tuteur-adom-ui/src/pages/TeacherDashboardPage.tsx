import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../redux/store';
import requestService from '../services/requestService';
import courseService from '../services/courseService';
import teacherService from '../services/teacherService';
import type { Request, Course, Appointment, Teacher } from '../types';
import AddCourseForm from '../components/courses/AddCourseForm';

const TeacherDashboardPage = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState<Request[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  
  // Vérifier si l'utilisateur est authentifié et est un enseignant
  if (!isAuthenticated || !user || user.role !== 'teacher') {
    return <Navigate to="/login" />;
  }

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
          const coursesData = await courseService.getCoursesByTeacher(user.id);
          setCourses(coursesData);
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
      setError('Une erreur est survenue lors de la mise à jour des cours');
      console.error(err);
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
      await teacherService.updateTeacherProfile(user.id, { cv: cvUrl });
      
      // Mettre à jour l'état local
      // Note: Dans une application réelle, nous rechargerions les données de l'utilisateur depuis le serveur
      window.location.reload();
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
      
      // Mettre à jour l'état local
      // Note: Dans une application réelle, nous rechargerions les données de l'utilisateur depuis le serveur
      window.location.reload();
    } catch (err) {
      setError('Erreur lors de la suppression du CV. Veuillez réessayer.');
      console.error(err);
    }
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
                              Parent
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
                            <tr key={request.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">ID: {request.parentId.slice(0, 8)}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{request.message}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  request.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : request.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {request.status === 'pending' ? 'En attente' : request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900">
                                  Voir détails
                                </button>
                              </td>
                            </tr>
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
                      className="btn-primary"
                    >
                      Ajouter un cours
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
                        <div key={course.id} className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg mb-2">{course.subject}</h3>
                          <p className="text-gray-700 mb-3">{course.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold">{course.hourlyRate} €/h</span>
                            <div className="space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                Modifier
                              </button>
                              <button className="text-red-600 hover:text-red-800">
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
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                    </div>
                    <h2 className="mt-4 text-xl font-bold">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="font-semibold mb-4">CV</h3>
                    {(user as Teacher).cv ? (
                      <div className="flex items-center justify-between">
                        <a
                          href={(user as Teacher).cv}
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
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="font-semibold mb-4">Informations du profil</h3>
                    
                    <div className="mt-4">
                      <button className="btn-primary w-full md:w-auto">
                        Modifier mon profil
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage; 