import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import type { Teacher } from '../../types';
import { formatHourlyRate, translateTeacherStatus } from '../../utils/currency';

const TeachersManagement = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pendingTeachers, setPendingTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [success, setSuccess] = useState<string | null>(null);

  // États pour la création d'admin
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    position: ''
  });

  useEffect(() => {
    loadTeachers();
  }, [activeTab, statusFilter]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Chargement des enseignants - Onglet actif:', activeTab);
      console.log('🔍 Filtre de statut:', statusFilter);

      if (activeTab === 'pending') {
        console.log('📡 Appel API: /api/teachers/admin/pending');
        const response = await api.get('/api/teachers/admin/pending');
        console.log('✅ Réponse API pending:', response.data);
        setPendingTeachers(response.data);
      } else {
        const url = statusFilter ? 
          `/api/teachers/admin/all?status=${statusFilter}` : 
          '/api/teachers/admin/all';
        console.log('📡 Appel API:', url);
        const response = await api.get(url);
        console.log('✅ Réponse API all:', response.data);
        setTeachers(response.data);
      }
    } catch (err: any) {
      console.error('❌ Erreur lors du chargement des enseignants:', err);
      console.error('❌ Détails de l\'erreur:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      setError(`Erreur lors du chargement des enseignants: ${err.response?.data || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (teacherId: string, newStatus: 'ACTIVE' | 'SUSPENDED') => {
    try {
      console.log('🔄 Mise à jour du statut:', { teacherId, newStatus });
      
      const response = await api.put(`/api/teachers/${teacherId}/status`, {
        status: newStatus
      });
      
      console.log('✅ Réponse de mise à jour:', response.data);

      // Actualiser la liste
      await loadTeachers();
      
      const action = newStatus === 'ACTIVE' ? 'approuvé' : 'suspendu';
      setSuccess(`L'enseignant a été ${action} avec succès !`);
      
      // Effacer le message après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('❌ Erreur lors de la mise à jour du statut:', err);
      console.error('❌ Détails de l\'erreur:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        method: err.config?.method,
        data: err.config?.data
      });
      
      let errorMessage = 'Erreur lors de la mise à jour du statut';
      if (err.response?.data) {
        errorMessage += `: ${err.response.data}`;
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      setError(errorMessage);
      
      // Effacer le message d'erreur après 5 secondes
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🔧 Création d\'un nouveau compte admin:', adminForm);
      const response = await api.post('/api/auth/register/admin', adminForm);
      console.log('✅ Admin créé avec succès:', response.data);
      
      setSuccess('Nouveau compte admin créé avec succès !');
      setShowCreateAdminModal(false);
      setAdminForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        position: ''
      });
      
      // Effacer le message après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('❌ Erreur lors de la création du compte admin:', err);
      console.error('❌ Détails de l\'erreur admin:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(`Erreur lors de la création du compte admin: ${err.response?.data || err.message}`);
      
      // Effacer le message d'erreur après 5 secondes
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleShowDetails = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case 'ACTIVE':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Actif</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">En attente</span>;
      case 'SUSPENDED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Suspendu</span>;
      default:
        return null;
    }
  };

  const teachersToDisplay = activeTab === 'pending' ? pendingTeachers : teachers;

  const filteredTeachers = teachersToDisplay.filter(teacher => {
    const matchesSearch = teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messages de statut */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* En-tête avec onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            En attente de validation ({pendingTeachers.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tous les enseignants
          </button>
        </nav>
      </div>

      {/* Filtres et bouton créer admin */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {activeTab === 'pending' ? 'Validation des Enseignants' : 'Gestion des Enseignants'}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateAdminModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Créer un compte admin
          </button>
          <input
            type="text"
            placeholder="Rechercher un enseignant..."
            className="px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
          {activeTab === 'all' && (
            <select 
              className="px-4 py-2 border rounded-md"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <option value="">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="PENDING">En attente</option>
              <option value="SUSPENDED">Suspendu</option>
            </select>
          )}
        </div>
      </div>

      {/* Liste des enseignants */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'pending' ? 'Aucun enseignant en attente' : 'Aucun enseignant trouvé'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'pending' 
                ? 'Tous les enseignants ont été validés.' 
                : 'Aucun enseignant ne correspond à vos critères de recherche.'
              }
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredTeachers.map((teacher) => (
              <li key={teacher.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {teacher.firstName} {teacher.lastName}
                        </h3>
                        {getStatusBadge(teacher.status || 'PENDING')}
                      </div>
                      <p className="text-sm text-gray-500">{teacher.subject}</p>
                      <p className="text-sm text-gray-500">{teacher.email}</p>
                                              <p className="text-sm text-gray-500">{formatHourlyRate(teacher.hourlyRate)}</p>
                                              <p className="text-xs text-green-600 font-medium">Statut: {translateTeacherStatus(teacher.status)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {(() => {
                      console.log(`👤 ${teacher.firstName}: status="${teacher.status}", normalized="${teacher.status?.toUpperCase()}"`);
                      console.log(`🔍 Conditions: isPending=${teacher.status?.toUpperCase() === 'PENDING'}, isSuspended=${teacher.status?.toUpperCase() === 'SUSPENDED'}`);
                      return null;
                    })()}
                    {(teacher.status?.toUpperCase() === 'PENDING' || teacher.status?.toUpperCase() === 'SUSPENDED') && (
                      <button
                        onClick={() => handleUpdateStatus(teacher.id, 'ACTIVE')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Approuver
                      </button>
                    )}
                    {teacher.status?.toUpperCase() !== 'SUSPENDED' && (
                      <button
                        onClick={() => handleUpdateStatus(teacher.id, 'SUSPENDED')}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Suspendre
                      </button>
                    )}
                    <button
                      onClick={() => handleShowDetails(teacher)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Détails
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal de création d'admin */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Créer un nouveau compte admin</h3>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={adminForm.firstName}
                    onChange={(e) => setAdminForm({...adminForm, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Nom"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={adminForm.lastName}
                    onChange={(e) => setAdminForm({...adminForm, lastName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Poste (ex: Administrateur principal)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={adminForm.position}
                    onChange={(e) => setAdminForm({...adminForm, position: e.target.value})}
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateAdminModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {showDetailsModal && selectedTeacher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-2xl mb-4">
                {selectedTeacher.firstName.charAt(0)}{selectedTeacher.lastName.charAt(0)}
              </div>
              <h3 className="text-xl font-bold">
                {selectedTeacher.firstName} {selectedTeacher.lastName}
              </h3>
              <div className="mb-2">{getStatusBadge(selectedTeacher.status || 'PENDING')}</div>
              <p className="text-gray-600">{selectedTeacher.email}</p>
              <p className="text-gray-600">{selectedTeacher.subject}</p>
                                      <p className="text-gray-600 font-semibold">{formatHourlyRate(selectedTeacher.hourlyRate)}</p>
              
              <div className="mt-4 w-full">
                <p className="font-semibold">Compétences :</p>
                <p className="text-gray-600 text-sm">{selectedTeacher.skills}</p>
              </div>
              
              <div className="mt-4 w-full">
                <p className="font-semibold">Bio :</p>
                <p className="text-gray-600 text-sm">{selectedTeacher.bio}</p>
              </div>
              
              <div className="mt-4 w-full">
                <p className="font-semibold">Lieux d'enseignement :</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedTeacher.teachingLocation?.map((location, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="font-semibold">Note moyenne :</p>
                <p className="text-gray-600">{selectedTeacher.rating} / 5</p>
              </div>
              
              <button
                onClick={() => setShowDetailsModal(false)}
                className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersManagement; 