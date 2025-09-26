import { useState } from 'react';
import type { Parent } from '../../types';

interface Child {
  id?: string;
  name: string;
  age: number;
  grade: string;
}

interface ChildrenManagementProps {
  parent: Parent;
  onUpdate: (children: Child[]) => void;
  onCancel: () => void;
}

const ChildrenManagement = ({ parent, onUpdate, onCancel }: ChildrenManagementProps) => {
  const [children, setChildren] = useState<Child[]>(
    parent.children?.map((child, index) => ({ ...child, id: `${index}` })) || []
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [newChild, setNewChild] = useState<Child>({
    name: '',
    age: 0,
    grade: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleAddChild = () => {
    if (!newChild.name.trim()) {
      setError('Le nom de l\'enfant est requis');
      return;
    }
    if (newChild.age <= 0 || newChild.age > 18) {
      setError('L\'âge doit être entre 1 et 18 ans');
      return;
    }
    if (!newChild.grade.trim()) {
      setError('La classe est requise');
      return;
    }

    const childToAdd = {
      ...newChild,
      id: Date.now().toString()
    };

    setChildren([...children, childToAdd]);
    setNewChild({ name: '', age: 0, grade: '' });
    setShowAddForm(false);
    setError(null);
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setNewChild({ ...child });
    setShowAddForm(true);
  };

  const handleUpdateChild = () => {
    if (!newChild.name.trim()) {
      setError('Le nom de l\'enfant est requis');
      return;
    }
    if (newChild.age <= 0 || newChild.age > 18) {
      setError('L\'âge doit être entre 1 et 18 ans');
      return;
    }
    if (!newChild.grade.trim()) {
      setError('La classe est requise');
      return;
    }

    setChildren(children.map(child => 
      child.id === editingChild?.id ? newChild : child
    ));
    setNewChild({ name: '', age: 0, grade: '' });
    setEditingChild(null);
    setShowAddForm(false);
    setError(null);
  };

  const handleDeleteChild = (childId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enfant ?')) {
      setChildren(children.filter(child => child.id !== childId));
    }
  };

  const handleSave = () => {
    onUpdate(children);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingChild(null);
    setNewChild({ name: '', age: 0, grade: '' });
    setError(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Gestion des enfants</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Liste des enfants */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Mes enfants</h3>
        
        {children.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun enfant ajouté</p>
        ) : (
          <div className="space-y-3">
            {children.map((child) => (
              <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{child.name}</h4>
                  <p className="text-sm text-gray-600">{child.age} ans - {child.grade}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditChild(child)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteChild(child.id!)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bouton pour ajouter un enfant */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary mb-4"
        >
          Ajouter un enfant
        </button>
      )}

      {/* Formulaire d'ajout/modification */}
      {showAddForm && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">
            {editingChild ? 'Modifier l\'enfant' : 'Ajouter un enfant'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={newChild.name}
                onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                className="input-field"
                placeholder="Ex: Lucas Dupont"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Âge
              </label>
              <input
                type="number"
                value={newChild.age || ''}
                onChange={(e) => setNewChild({ ...newChild, age: parseInt(e.target.value) || 0 })}
                className="input-field"
                min="1"
                max="18"
                placeholder="Ex: 14"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Classe
              </label>
              <input
                type="text"
                value={newChild.grade}
                onChange={(e) => setNewChild({ ...newChild, grade: e.target.value })}
                className="input-field"
                placeholder="Ex: 3ème"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={editingChild ? handleUpdateChild : handleAddChild}
              className="btn-primary"
            >
              {editingChild ? 'Mettre à jour' : 'Ajouter'}
            </button>
            <button
              onClick={cancelForm}
              className="btn-secondary"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          onClick={onCancel}
          className="btn-secondary"
        >
          Fermer
        </button>
        <button
          onClick={handleSave}
          className="btn-primary"
        >
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  );
};

export default ChildrenManagement; 