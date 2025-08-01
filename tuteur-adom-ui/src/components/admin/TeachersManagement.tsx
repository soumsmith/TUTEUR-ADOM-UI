import { useState, useEffect } from 'react';
import { mockTeachers } from '../../services/mockData';
import type { Teacher } from '../../types';

const TeachersManagement = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Pour le moment, on utilise les données mockées
    setTeachers(mockTeachers);
    setLoading(false);
  }, []);

  const handleApproveTeacher = (teacherId: string) => {
    setTeachers(teachers.map(teacher => {
      if (teacher.id === teacherId) {
        return { ...teacher, status: 'active' };
      }
      return teacher;
    }));
    // Afficher un message de confirmation
    alert('L\'enseignant a été approuvé avec succès');
  };

  const handleSuspendTeacher = (teacherId: string) => {
    setTeachers(teachers.map(teacher => {
      if (teacher.id === teacherId) {
        return { ...teacher, status: 'suspended' };
      }
      return teacher;
    }));
    // Afficher un message de confirmation
    alert('L\'enseignant a été suspendu avec succès');
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

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Gestion des Enseignants</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Rechercher un enseignant..."
            className="px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select 
            className="px-4 py-2 border rounded-md"
            value={statusFilter}
            onChange={handleStatusFilter}
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTeachers.map((teacher) => (
            <li key={teacher.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={teacher.profilePicture}
                    alt={`${teacher.firstName} ${teacher.lastName}`}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {teacher.firstName} {teacher.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{teacher.subject}</p>
                    <p className="text-sm text-gray-500">{teacher.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproveTeacher(teacher.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    disabled={teacher.status === 'active'}
                  >
                    Approuver
                  </button>
                  <button
                    onClick={() => handleSuspendTeacher(teacher.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    disabled={teacher.status === 'suspended'}
                  >
                    Suspendre
                  </button>
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
      </div>

      {/* Modal de détails */}
      {showDetailsModal && selectedTeacher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex flex-col items-center">
              <img
                src={selectedTeacher.profilePicture}
                alt={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
                className="h-24 w-24 rounded-full mb-4"
              />
              <h3 className="text-xl font-bold">
                {selectedTeacher.firstName} {selectedTeacher.lastName}
              </h3>
              <p className="text-gray-600">{selectedTeacher.email}</p>
              <p className="text-gray-600">{selectedTeacher.subject}</p>
              <div className="mt-4">
                <p className="font-semibold">Compétences :</p>
                <p className="text-gray-600">{selectedTeacher.skills}</p>
              </div>
              <div className="mt-4">
                <p className="font-semibold">Bio :</p>
                <p className="text-gray-600">{selectedTeacher.bio}</p>
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