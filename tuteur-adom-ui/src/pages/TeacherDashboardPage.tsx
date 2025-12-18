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
  
  if (!isAuthenticated || !user || user.role !== 'teacher') {
    return <Navigate to="/login" />;
  }

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
            console.warn('API courses non disponible:', courseError);
            setCourses([]);
            setError(null);
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
      console.warn('Impossible de recharger les cours:', err);
      setShowAddCourseForm(false);
    }
  };

  type CourseStatus = 'pending' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'cancelled';

const getStatusBadge = (status: CourseStatus) => {
  const badges = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente', icon: '⏳' },
    approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Approuvée', icon: '✓' },
    rejected: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Refusée', icon: '✗' },
    scheduled: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Planifié', icon: '📅' },
    completed: { bg: 'bg-green-50', text: 'text-green-700', label: 'Terminé', icon: '✓' },
    cancelled: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Annulé', icon: '✗' }
  };
  const badge = badges[status] || badges.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${badge.bg} ${badge.text} rounded-full text-xs font-medium`}>
      <span>{badge.icon}</span>
      {badge.label}
    </span>
  );
};

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Le fichier est trop volumineux. Taille maximale : 5MB');
      return;
    }
    
    if (!file.type.includes('pdf')) {
      setError('Seuls les fichiers PDF sont acceptés');
      return;
    }

    try {
      setUploadingCV(true);
      setError(null);
      const cvUrl = await teacherService.uploadCV(user.id, file);
      const updatedUser = { ...user, cv: cvUrl };
      setCurrentUser(updatedUser);
      setCvSuccess('CV téléchargé avec succès !');
      setTimeout(() => setCvSuccess(null), 3000);
    } catch (err) {
      setError('Erreur lors du téléchargement du CV');
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
      const updatedUser = { ...user, cv: undefined };
      setCurrentUser(updatedUser);
      setCvSuccess('CV supprimé avec succès !');
      setTimeout(() => setCvSuccess(null), 3000);
    } catch (err) {
      setError('Erreur lors de la suppression du CV');
      console.error(err);
    }
  };

  const handleEditProfileSuccess = () => {
    setShowEditProfileForm(false);
    setProfileSuccess('Profil mis à jour avec succès !');
    
    const reloadUserData = async () => {
      try {
        const updatedTeacher = await teacherService.getTeacherById(user.id);
        setCurrentUser(updatedTeacher);
      } catch (err) {
        console.error('Erreur lors du rechargement:', err);
      }
    };
    reloadUserData();
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
      const coursesData = await courseService.getCoursesByTeacher(user.id);
      setCourses(coursesData);
    } catch (err) {
      setError('Erreur lors de la suppression du cours');
      console.error(err);
    }
  };

  const handleEditCourseSuccess = () => {
    setShowEditCourseForm(false);
    setEditingCourse(null);
    
    const reloadCourses = async () => {
      try {
        const coursesData = await courseService.getCoursesByTeacher(user.id);
        setCourses(coursesData);
      } catch (err) {
        console.error('Erreur:', err);
      }
    };
    reloadCourses();
  };

  const handleShowRequestDetails = (request: Request) => {
    setSelectedRequest(request);
    setShowRequestDetailsModal(true);
  };

  const RequestDetailsModal = ({ request, onClose }: { request: Request; onClose: () => void }) => {
    const { parent, teacher, course, loading } = useAdminDetails(request.parentId, request.teacherId, request.courseId);

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl">
            <h3 className="text-2xl font-bold">Détails de la demande</h3>
            <p className="text-blue-100 text-sm mt-1">Informations complètes sur cette demande</p>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                #
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">ID de la demande</p>
                <p className="font-mono text-sm font-semibold text-gray-900">#{request.id.slice(0, 8)}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">👤 Parent</p>
                {loading ? (
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ) : parent ? (
                  <div>
                    <p className="font-semibold text-gray-900">{parent.firstName} {parent.lastName}</p>
                    <p className="text-sm text-gray-600">{parent.email}</p>
                  </div>
                ) : (
                  <p className="text-red-500 text-sm">Parent non trouvé</p>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">👨‍🏫 Enseignant</p>
                {loading ? (
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ) : teacher ? (
                  <div>
                    <p className="font-semibold text-gray-900">{teacher.firstName} {teacher.lastName}</p>
                    <p className="text-sm text-blue-600">{teacher.subject}</p>
                  </div>
                ) : (
                  <p className="text-red-500 text-sm">Enseignant non trouvé</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">📚 Cours demandé</p>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-green-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-green-200 rounded animate-pulse w-3/4"></div>
                </div>
              ) : course ? (
                <div>
                  <p className="font-bold text-gray-900 text-lg">{course.subject}</p>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">{course.hourlyRate} FCFA/h</p>
                </div>
              ) : (
                <p className="text-red-500 text-sm">Cours non trouvé</p>
              )}
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">💬 Message</p>
              <p className="text-gray-700 leading-relaxed">{request.message}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-medium">Date de création</p>
                <p className="font-semibold text-gray-900">{new Date(request.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Statut</p>
                {getStatusBadge(request.status)}
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                >
                  ✓ Approuver
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                >
                  ✗ Rejeter
                </button>
              </div>
            )}
            
            <button 
              onClick={onClose}
              className="w-full mt-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RequestRow = ({ request }: { request: Request }) => {
    const { parent, course, loading } = useAdminDetails(request.parentId, request.teacherId, request.courseId);

    return (
      <tr className="hover:bg-blue-50/50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="font-mono text-sm font-semibold text-gray-900">#{request.id.slice(0, 8)}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {loading ? (
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          ) : parent ? (
            <div>
              <div className="font-semibold text-gray-900">{parent.firstName} {parent.lastName}</div>
              <div className="text-sm text-gray-500">{parent.email}</div>
            </div>
          ) : (
            <span className="text-red-500 text-sm">Non trouvé</span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {loading ? (
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          ) : course ? (
            <div>
              <div className="font-semibold text-gray-900">{course.subject}</div>
              <div className="text-sm text-green-600 font-medium">{course.hourlyRate} FCFA/h</div>
            </div>
          ) : (
            <span className="text-red-500 text-sm">Non trouvé</span>
          )}
        </td>
        <td className="px-6 py-4">
          <div className="max-w-xs truncate text-sm text-gray-700">{request.message}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {new Date(request.createdAt).toLocaleDateString('fr-FR')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {getStatusBadge(request.status)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <button 
            onClick={() => handleShowRequestDetails(request)}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline"
          >
            Voir détails →
          </button>
        </td>
      </tr>
    );
  };

  const tabs = [
    { id: 'requests', label: 'Demandes', icon: '📋' },
    { id: 'appointments', label: 'Rendez-vous', icon: '📅' },
    { id: 'courses', label: 'Mes cours', icon: '📚' },
    { id: 'profile', label: 'Mon profil', icon: '👤' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tableau de bord enseignant
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Gérez vos demandes, rendez-vous et cours en toute simplicité
          </p>
        </div>
        
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-fit py-4 px-6 text-center border-b-3 font-semibold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-in slide-in-from-top duration-300">
                <p className="font-semibold">⚠️ {error}</p>
              </div>
            )}
            
            {cvSuccess && (
              <div className="p-4 mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg animate-in slide-in-from-top duration-300">
                <p className="font-semibold">✓ {cvSuccess}</p>
              </div>
            )}
            
            {profileSuccess && (
              <div className="p-4 mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg animate-in slide-in-from-top duration-300">
                <p className="font-semibold">✓ {profileSuccess}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-500 font-medium">Chargement en cours...</p>
              </div>
            ) : (
              <>
                {activeTab === 'requests' && (
                  <>
                    {requests.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune demande en attente</h3>
                        <p className="text-gray-600">
                          Vous n'avez pas de nouvelles demandes de cours pour le moment.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Parent</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Cours</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Message</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                              <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
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
                
                {activeTab === 'appointments' && (
                  <>
                    {appointments.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun rendez-vous programmé</h3>
                        <p className="text-gray-600">
                          Vous n'avez pas de rendez-vous à venir pour le moment.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {appointments.map(appointment => (
                          <div key={appointment.id} className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                                  📅
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-lg">{appointment.date}</p>
                                  <p className="text-blue-600 font-semibold">{appointment.startTime} - {appointment.endTime}</p>
                                </div>
                              </div>
                              {getStatusBadge(appointment.status)}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <span className="text-xl">👤</span>
                                <span>ID Parent: {appointment.parentId.slice(0, 8)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <span className="text-xl">📍</span>
                                <span>{appointment.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
                
                {activeTab === 'courses' && (
                  <>
                    <div className="flex justify-end mb-6 gap-3">
                      <button
                        onClick={() => setShowAddCourseForm(true)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                      >
                        ➕ Ajouter un cours
                      </button>
                    </div>
                    
                    {showAddCourseForm ? (
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <AddCourseForm
                          teacherId={user.id}
                          onSuccess={handleAddCourseSuccess}
                          onCancel={() => setShowAddCourseForm(false)}
                        />
                      </div>
                    ) : courses.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun cours créé</h3>
                        <p className="text-gray-600 mb-6">
                          Créez des cours pour que les parents puissent les voir et faire des demandes.
                        </p>
                        <button
                          onClick={() => setShowAddCourseForm(true)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg"
                        >
                          Créer mon premier cours
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                          <div key={course.id} className="group bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                            <div className="mb-4">
                              <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{course.subject}</h3>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{course.description}</p>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-xs font-bold text-gray-500 uppercase mb-2">📍 Lieux d'enseignement</p>
                              <div className="flex flex-wrap gap-2">
                                {course.locations?.map((location, index) => (
                                  <span 
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                                  >
                                    {location}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mb-4 pb-4 border-b border-gray-200">
                              <p className="text-xs text-gray-500">
                                Créé le {new Date(course.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {formatHourlyRate(course.hourlyRate)}
                              </span>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEditCourse(course)}
                                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors"
                                >
                                  ✏️ Modifier
                                </button>
                                <button 
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
                
                {activeTab === 'profile' && (
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8 text-center">
                      <div className="inline-block relative group">
                        <div className="h-32 w-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl transform group-hover:scale-110 transition-transform">
                          <div className="flex items-center justify-center h-full w-full text-white text-4xl font-bold">
                            {currentUser?.firstName.charAt(0)}{currentUser?.lastName.charAt(0)}
                          </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                          <span className="text-white text-lg">✓</span>
                        </div>
                      </div>
                      <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </h2>
                      <p className="text-blue-600 font-semibold mt-1">{currentUser?.email}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl mb-6 border border-blue-100 shadow-lg">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl">
                          📄
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Curriculum Vitae</h3>
                      </div>
                      
                      {(currentUser as Teacher)?.cv ? (
                        <div className="bg-white p-6 rounded-xl border border-blue-200">
                          <div className="flex items-center justify-between">
                            <a
                              href={(currentUser as Teacher).cv}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 text-blue-600 hover:text-blue-800 font-semibold group"
                            >
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                </svg>
                              </div>
                              <span className="text-lg">Voir mon CV</span>
                            </a>
                            <button
                              onClick={handleDeleteCV}
                              className="px-6 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-colors"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-700 mb-6 text-lg">
                            💡 Ajoutez votre CV pour augmenter vos chances d'être sélectionné par les parents.
                          </p>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handleCVUpload}
                              disabled={uploadingCV}
                              className="block w-full text-sm text-gray-700
                                file:mr-4 file:py-3 file:px-6
                                file:rounded-xl file:border-0
                                file:text-sm file:font-bold
                                file:bg-gradient-to-r file:from-blue-500 file:to-indigo-600
                                file:text-white
                                hover:file:from-blue-600 hover:file:to-indigo-700
                                file:cursor-pointer file:transition-all
                                disabled:opacity-50 disabled:cursor-not-allowed
                                cursor-pointer bg-white p-4 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors"
                            />
                            {uploadingCV && (
                              <div className="mt-4 flex items-center gap-3 text-blue-600">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                                <span className="font-semibold">Téléchargement en cours...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100 shadow-lg">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-2xl">
                          ⚙️
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Informations du profil</h3>
                      </div>
                      
                      <button 
                        onClick={() => setShowEditProfileForm(true)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                      >
                        ✏️ Modifier mon profil
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showEditProfileForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <EditProfileForm
              teacher={currentUser as Teacher}
              onSuccess={handleEditProfileSuccess}
              onCancel={() => setShowEditProfileForm(false)}
            />
          </div>
        </div>
      )}

      {showEditCourseForm && editingCourse && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
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

      {showRequestDetailsModal && selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => {
            setSelectedRequest(null);
            setShowRequestDetailsModal(false);
          }}
        />
      )}
    </div>
  );
};

export default TeacherDashboardPage;