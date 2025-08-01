import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import RequestsManagement from '../components/admin/RequestsManagement';
import AppointmentsManagement from '../components/admin/AppointmentsManagement';
import TeachersManagement from '../components/admin/TeachersManagement';
import ParentsManagement from '../components/admin/ParentsManagement';
import type { RootState } from '../redux/store';

const AdminDashboardPage = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('requests');
  
  // Vérifier si l'utilisateur est authentifié et est un administrateur
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Demandes en attente</h3>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-green-800 mb-1">Rendez-vous à venir</h3>
            <p className="text-2xl font-bold text-green-600">18</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800 mb-1">Enseignants actifs</h3>
            <p className="text-2xl font-bold text-yellow-600">34</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-purple-800 mb-1">Parents inscrits</h3>
            <p className="text-2xl font-bold text-purple-600">67</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 