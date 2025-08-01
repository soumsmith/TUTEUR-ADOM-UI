import axios from 'axios';

// Base URL de l'API
const API_URL = 'http://localhost:8484/api';

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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    if (error.response && error.response.status === 401) {
      // Session expirée ou non authentifiée
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 