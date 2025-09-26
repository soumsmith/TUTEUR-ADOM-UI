import axios from 'axios';

// Base URL de l'API - suppression du /api pour éviter le double préfixe
const API_URL = 'http://localhost:8484';

// Création d'une instance Axios avec des configurations par défaut
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simuler un délai de réponse pour les données mockées
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

// Intercepteur pour simuler les réponses en mode développement
api.interceptors.request.use(
  async (config) => {
    // Commenté pour utiliser le vrai backend
    // if (process.env.NODE_ENV === 'development') {
    //   await mockDelay();
    //   // Simuler une erreur réseau pour voir comment l'application réagit
    //   throw new Error('Network Error - Le backend n\'est pas encore disponible. Utilisez les données mockées.');
    // }

    // En production, ajouter le token d'authentification
    // TEMPORAIRE: désactiver l'auth pour les endpoints admin car le backend n'est pas encore configuré pour JWT
    const isAuthEndpoint = config.url?.includes('/auth/');
    const isAdminOperation = config.url?.includes('/admin/') || 
                            config.url?.match(/\/api\/teachers\/\d+\/status/) || // Opérations de mise à jour de statut
                            (config.url?.match(/\/api\/teachers\/\d+$/) && config.method?.toUpperCase() === 'PUT') || // Mise à jour de profil
                            (config.url?.match(/\/api\/teachers\/\d+$/) && config.method?.toUpperCase() === 'GET'); // Lecture de profil
    
    // TEMPORAIRE: désactiver complètement l'auth pour tous les endpoints publics 
    // Le backend n'est pas encore configuré pour l'authentification JWT
    // Ne pas envoyer de token pour l'instant
    // if (!isAuthEndpoint && !isAdminOperation) {
    //   const token = localStorage.getItem('token');
    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    //   }
    // }
    
    console.log('🌐 Requête API:', {
      url: config.url,
      method: config.method,
      hasAuth: !!config.headers.Authorization,
      isAuthEndpoint,
      isAdminOperation,
      skipAuth: isAuthEndpoint || isAdminOperation
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Ne déconnecter que si c'est une vraie erreur d'authentification
    // et pas juste une erreur de connexion au backend
    if (error.response && error.response.status === 401 && error.response.data?.message?.includes('authentification')) {
      // Session expirée ou non authentifiée
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 