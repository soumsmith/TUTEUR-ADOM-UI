import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import type { RootState } from '../redux/store';
import requestService from '../services/requestService';
import type { Request, Appointment, Parent } from '../types';
import EditParentForm from '../components/parents/EditParentForm';
import ChildrenManagement from '../components/parents/ChildrenManagement';
import RequestDetailsRow from '../components/parents/RequestDetailsRow';

const ParentDashboardPage = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState<Request[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [showChildrenManagement, setShowChildrenManagement] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  
  // Vérifier si l'utilisateur est authentifié et est un parent
  if (!isAuthenticated || !user || user.role !== 'parent') {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Chargement des données en fonction de l'onglet actif
        if (activeTab === 'requests') {
          const requestsData = await requestService.getParentRequests(user.id);
          setRequests(requestsData);
        } else if (activeTab === 'appointments') {
          const appointmentsData = await requestService.getParentAppointments(user.id);
          setAppointments(appointmentsData);
        }
        
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, user.id]);

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

  const handleEditProfileSuccess = () => {
    setShowEditProfileForm(false);
    setProfileSuccess('Profil mis à jour avec succès !');
    
    // Effacer le message de succès après 3 secondes
    setTimeout(() => setProfileSuccess(null), 3000);
  };

  const handleChildrenUpdate = (children: { id?: string; name: string; age: number; grade: string; }[]) => {
    // Mettre à jour l'utilisateur local avec les nouvelles informations des enfants
    const updatedUser = {
      ...currentUser,
      children: children.map(({ id, ...child }) => child) // Retirer l'id temporaire
    } as Parent;
    setCurrentUser(updatedUser);
    setShowChildrenManagement(false);
    setProfileSuccess('Informations des enfants mises à jour avec succès !');
    
    // Effacer le message de succès après 3 secondes
    setTimeout(() => setProfileSuccess(null), 3000);
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
        return <span className="px-2 py-1 bg-gray-100_ text-gray-800 rounded-full text-xs">Annulé</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord parent</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos demandes et rendez-vous
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
              Mes demandes
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mes rendez-vous
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
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande pour le moment</h3>
                      <p className="text-gray-600 mb-4">
                        Vous n'avez pas encore fait de demande de cours.
                      </p>
                      <Link
                        to="/teachers"
                        className="btn-primary"
                      >
                        Rechercher un enseignant
                      </Link>
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
                              Enseignant
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cours
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Message
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {requests.map(request => (
                            <RequestDetailsRow
                              key={request.id}
                              request={request}
                              formatDate={formatDate}
                              getStatusBadge={getStatusBadge}
                            />
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
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous pour le moment</h3>
                      <p className="text-gray-600">
                        Vos rendez-vous planifiés s'afficheront ici une fois que vos demandes auront été approuvées.
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
                              Enseignant
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
                                <div className="text-sm text-gray-900">ID: {appointment.teacherId.slice(0, 8)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{appointment.location}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(appointment.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
              
              {/* Onglet Profil */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl mx-auto">
                  {profileSuccess && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                      {profileSuccess}
                    </div>
                  )}
                  <div className="mb-4 text-center">
                    <div className="inline-block h-24 w-24 rounded-full overflow-hidden bg-gray-100_">
                      <div className="flex items-center justify-center h-full w-full bg-blue-500 text-white text-2xl font-bold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                    </div>
                    <h2 className="mt-4 text-xl font-bold">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">Informations du profil</h3>
                    
                    <div className="mt-4">
                      <button 
                        onClick={() => setShowEditProfileForm(true)}
                        className="btn-primary w-full md:w-auto mr-3"
                      >
                        Modifier mon profil
                      </button>
                      <button 
                        onClick={() => setShowChildrenManagement(true)}
                        className="btn-secondary w-full md:w-auto"
                      >
                        Gérer mes enfants
                      </button>
                    </div>
                  </div>

                  {/* Section des enfants */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-4">Mes enfants</h3>
                    
                    {currentUser && (currentUser as Parent).children && (currentUser as Parent).children!.length > 0 ? (
                      <div className="space-y-2">
                        {(currentUser as Parent).children!.map((child: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <h4 className="font-medium">{child.name}</h4>
                              <p className="text-sm text-gray-600">{child.age} ans - {child.grade}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">Aucun enfant ajouté</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Formulaire de modification de profil */}
              {showEditProfileForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <EditParentForm
                      parent={user as Parent}
                      onSuccess={handleEditProfileSuccess}
                      onCancel={() => setShowEditProfileForm(false)}
                    />
                  </div>
                </div>
              )}

              {/* Modale de gestion des enfants */}
              {showChildrenManagement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <ChildrenManagement
                      parent={currentUser as Parent}
                      onUpdate={handleChildrenUpdate}
                      onCancel={() => setShowChildrenManagement(false)}
                    />
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

export default ParentDashboardPage; 