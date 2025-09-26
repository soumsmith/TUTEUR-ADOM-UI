import api from './api';
import type { Parent } from '../types';

const parentService = {
  getAllParents: async (): Promise<Parent[]> => {
    try {
      console.log('🔄 Chargement des parents depuis l\'API backend');
      
      // Appeler l'API backend pour récupérer tous les parents
      const response = await api.get('/api/parents');
      console.log('✅ Parents reçus du backend:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des parents depuis l\'API:', error);
      
      // Fallback vers des données mockées pour l'instant
      console.log('🔄 Utilisation des données mockées');
      return [
        {
          id: '5',
          firstName: 'Pierre',
          lastName: 'Durand',
          email: 'pierre.durand@email.com',
          role: 'parent',
          children: [
            { name: 'Lucas Durand', age: 14, grade: '3ème' },
            { name: 'Emma Durand', age: 16, grade: '1ère' }
          ]
        },
        {
          id: '6',
          firstName: 'Anne',
          lastName: 'Leclerc',
          email: 'anne.leclerc@email.com',
          role: 'parent',
          children: [
            { name: 'Léa Leclerc', age: 15, grade: '2nde' }
          ]
        }
      ] as Parent[];
    }
  },

  updateParentStatus: async (parentId: string, status: 'active' | 'blocked'): Promise<void> => {
    try {
      console.log(`🔄 Mise à jour du statut du parent ${parentId} vers ${status}`);
      
      // Appeler l'API backend pour mettre à jour le statut
      await api.put(`/api/parents/${parentId}/status`, { status });
      console.log('✅ Statut du parent mis à jour avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      throw new Error('Impossible de mettre à jour le statut du parent');
    }
  }
};

export default parentService; 