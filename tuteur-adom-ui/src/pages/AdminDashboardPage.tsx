import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import RequestsManagement from '../components/admin/RequestsManagement';
import AppointmentsManagement from '../components/admin/AppointmentsManagement';
import TeachersManagement from '../components/admin/TeachersManagement';
import ParentsManagement from '../components/admin/ParentsManagement';
import api from '../services/api';
import type { RootState } from '../redux/store';

interface Stats {
  teachers: {
    active: number;
    pending: number;
    suspended: number;
    total: number;
  };
  parents: {
    total: number;
  };
  requests: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  appointments: {
    scheduled: number;
    completed: number;
    cancelled: number;
    total: number;
  };
}

const AdminDashboardPage = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('requests');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  
  // Vérifier si l'utilisateur est authentifié et est un administrateur
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const loadStats = async () => {
      try {
        console.log('📊 Chargement des statistiques...');
        const response = await api.get('/api/admin/stats');
        console.log('📊 Statistiques reçues:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
        <p className="text-gray-600 mt-1">
          Gérez les demandes, les rendez-vous et les utilisateurs
        </p>
      </div>
      
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
            Demandes en attente
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
            onClick={() => setActiveTab('teachers')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'teachers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Enseignants
          </button>
          <button
            onClick={() => setActiveTab('parents')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'parents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Parents
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'requests' && <RequestsManagement />}
        {activeTab === 'appointments' && <AppointmentsManagement />}
        {activeTab === 'teachers' && <TeachersManagement />}
        {activeTab === 'parents' && <ParentsManagement />}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h2>
        {loadingStats ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-1">Demandes en attente</h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.requests?.pending || 0}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-green-800 mb-1">Rendez-vous à venir</h3>
              <p className="text-2xl font-bold text-green-600">
                {stats?.appointments?.scheduled || 0}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-yellow-800 mb-1">Enseignants actifs</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {stats?.teachers?.active || 0}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-purple-800 mb-1">Parents inscrits</h3>
              <p className="text-2xl font-bold text-purple-600">
                {stats?.parents?.total || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage; 