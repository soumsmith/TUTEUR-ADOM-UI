import { useState, useEffect } from 'react';
import type { User } from '../../types';

interface Parent extends User {
  status: 'active' | 'blocked';
  children?: {
    name: string;
    age: number;
    grade: string;
  }[];
}

// Données mockées pour les parents (à remplacer par une vraie API)
const mockParents: Parent[] = [
  {
    id: 'p1',
    firstName: 'Claire',
    lastName: 'Dubois',
    email: 'claire.dubois@example.com',
    role: 'parent',
    status: 'active',
    profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg',
    children: [
      { name: 'Lucas', age: 12, grade: '5ème' },
      { name: 'Emma', age: 15, grade: '2nde' }
    ]
  },
  {
    id: 'p2',
    firstName: 'Pierre',
    lastName: 'Lambert',
    email: 'pierre.lambert@example.com',
    role: 'parent',
    status: 'active',
    profilePicture: 'https://randomuser.me/api/portraits/men/54.jpg',
    children: [
      { name: 'Sophie', age: 14, grade: '4ème' }
    ]
  },
  {
    id: 'p3',
    firstName: 'Marie',
    lastName: 'Robert',
    email: 'marie.robert@example.com',
    role: 'parent',
    status: 'blocked',
    profilePicture: 'https://randomuser.me/api/portraits/women/42.jpg',
    children: [
      { name: 'Thomas', age: 16, grade: '1ère' },
      { name: 'Julie', age: 13, grade: '4ème' }
    ]
  }
];

const ParentsManagement = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    // Pour le moment, on utilise les données mockées
    setParents(mockParents);
    setLoading(false);
  }, []);

  const handleBlockParent = (parentId: string) => {
    setParents(parents.map(parent => {
      if (parent.id === parentId) {
        return { ...parent, status: 'blocked' as const };
      }
      return parent;
    }));
    // Afficher un message de confirmation
    alert('Le parent a été bloqué avec succès');
  };

  const handleUnblockParent = (parentId: string) => {
    setParents(parents.map(parent => {
      if (parent.id === parentId) {
        return { ...parent, status: 'active' as const };
      }
      return parent;
    }));
    // Afficher un message de confirmation
    alert('Le parent a été débloqué avec succès');
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleShowDetails = (parent: Parent) => {
    setSelectedParent(parent);
    setShowDetailsModal(true);
  };

  const filteredParents = parents.filter(parent => {
    const matchesSearch = parent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || parent.status === statusFilter;
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
        <h2 className="text-xl font-semibold text-gray-900">Gestion des Parents</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Rechercher un parent..."
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
            <option value="blocked">Bloqué</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredParents.map((parent) => (
            <li key={parent.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={parent.profilePicture}
                    alt={`${parent.firstName} ${parent.lastName}`}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {parent.firstName} {parent.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{parent.email}</p>
                    <p className="text-sm text-gray-500">
                      {parent.children?.length} enfant{parent.children?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBlockParent(parent.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    disabled={parent.status === 'blocked'}
                  >
                    Bloquer
                  </button>
                  <button
                    onClick={() => handleUnblockParent(parent.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    disabled={parent.status === 'active'}
                  >
                    Débloquer
                  </button>
                  <button
                    onClick={() => handleShowDetails(parent)}
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
      {showDetailsModal && selectedParent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex flex-col items-center">
              <img
                src={selectedParent.profilePicture}
                alt={`${selectedParent.firstName} ${selectedParent.lastName}`}
                className="h-24 w-24 rounded-full mb-4"
              />
              <h3 className="text-xl font-bold">
                {selectedParent.firstName} {selectedParent.lastName}
              </h3>
              <p className="text-gray-600">{selectedParent.email}</p>
              <div className="mt-4 w-full">
                <p className="font-semibold">Enfants :</p>
                <ul className="mt-2">
                  {selectedParent.children?.map((child, index) => (
                    <li key={index} className="bg-gray-50 p-2 rounded-md mb-2">
                      <p className="font-medium">{child.name}</p>
                      <p className="text-sm text-gray-600">
                        {child.age} ans - {child.grade}
                      </p>
                    </li>
                  ))}
                </ul>
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

export default ParentsManagement; 