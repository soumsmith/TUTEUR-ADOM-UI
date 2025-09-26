import api from './api';
import type { Request, Appointment } from '../types';
import { mockRequests, mockAppointments } from './mockData';
import { TeachingLocation } from '../types';

interface CreateRequestData {
  teacherId: string;
  courseId: string;
  message: string;
}

interface CreateAppointmentData {
  requestId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: TeachingLocation;
}

// Fonction pour charger les demandes depuis le localStorage
const loadRequestsFromStorage = (): Request[] => {
  try {
    const stored = localStorage.getItem('tuteur-adom-requests');
    return stored ? JSON.parse(stored) : [...mockRequests];
  } catch (error) {
    console.error('Erreur lors du chargement des demandes depuis le localStorage:', error);
    return [...mockRequests];
  }
};

// Fonction pour sauvegarder les demandes dans le localStorage
const saveRequestsToStorage = (requests: Request[]): void => {
  try {
    localStorage.setItem('tuteur-adom-requests', JSON.stringify(requests));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des demandes dans le localStorage:', error);
  }
};

// Fonction pour charger les rendez-vous depuis le localStorage
const loadAppointmentsFromStorage = (): Appointment[] => {
  try {
    const stored = localStorage.getItem('tuteur-adom-appointments');
    return stored ? JSON.parse(stored) : [...mockAppointments];
  } catch (error) {
    console.error('Erreur lors du chargement des rendez-vous depuis le localStorage:', error);
    return [...mockAppointments];
  }
};

// Fonction pour sauvegarder les rendez-vous dans le localStorage
const saveAppointmentsToStorage = (appointments: Appointment[]): void => {
  try {
    localStorage.setItem('tuteur-adom-appointments', JSON.stringify(appointments));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des rendez-vous dans le localStorage:', error);
  }
};

const requestService = {
  createRequest: async (parentId: string, requestData: CreateRequestData): Promise<Request> => {
    console.log('🔄 Création de demande via l\'API backend');
    
    // Validation des IDs avant envoi
    const parentIdNum = parseInt(parentId);
    const teacherIdNum = parseInt(requestData.teacherId);
    const courseIdNum = parseInt(requestData.courseId);
    
    if (isNaN(parentIdNum) || isNaN(teacherIdNum) || isNaN(courseIdNum)) {
      throw new Error(`IDs invalides: parentId=${parentId}, teacherId=${requestData.teacherId}, courseId=${requestData.courseId}`);
    }
    
    console.log('📋 Données à envoyer:', {
      parentId: parentIdNum,
      teacherId: teacherIdNum,
      courseId: courseIdNum,
      message: requestData.message
    });
    
    // Appeler l'API backend pour créer la demande
    const response = await api.post('/api/requests', {
      parentId: parentIdNum,
      teacherId: teacherIdNum,
      courseId: courseIdNum,
      message: requestData.message
    });
    
    console.log('✅ Demande créée dans la base de données:', response.data);
    return response.data;
  },

  getParentRequests: async (parentId: string): Promise<Request[]> => {
    console.log(`🔄 Chargement des demandes pour le parent ${parentId} depuis l'API backend`);
    
    // Appeler l'API backend pour récupérer les demandes du parent
    const response = await api.get(`/api/requests/parent/${parentId}`);
    console.log('✅ Demandes reçues du backend:', response.data);
    
    return response.data;
  },

  getRequestsByTeacher: async (teacherId: string): Promise<Request[]> => {
    console.log(`🔄 Chargement des demandes pour l'enseignant ${teacherId} depuis l'API backend`);
    
    // Appeler l'API backend pour récupérer les demandes de l'enseignant
    const response = await api.get(`/api/requests/teacher/${teacherId}`);
    console.log('✅ Demandes reçues du backend:', response.data);
    
    return response.data;
  },

  updateRequestStatus: async (requestId: string, status: 'approved' | 'rejected'): Promise<Request> => {
    console.log(`🔄 Mise à jour du statut de la demande ${requestId} vers '${status}' via l'API backend`);
    
    // Convertir requestId en number si nécessaire
    const requestIdNum = parseInt(requestId);
    if (isNaN(requestIdNum)) {
      throw new Error(`ID de demande invalide: ${requestId}`);
    }
    
    // Appeler l'API backend pour mettre à jour le statut
    const response = await api.put(`/api/requests/${requestIdNum}/status`, {
      status: status
    });
    
    console.log('✅ Statut de demande mis à jour dans la base de données:', response.data);
    return response.data;
  },

  getAllPendingRequests: async (): Promise<Request[]> => {
    console.log('🔄 Chargement des demandes en attente depuis l\'API backend');
    
    // Appeler l'API backend pour récupérer les demandes en attente
    const response = await api.get('/api/requests/pending');
    console.log('✅ Demandes en attente reçues du backend:', response.data);
    
    return response.data;
  },

  // Services pour les rendez-vous
  createAppointment: async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
    console.log('🔄 Création de rendez-vous via l\'API backend');
    console.log('📋 Données à envoyer:', appointmentData);
    
    // Appeler l'API backend pour créer le rendez-vous
    const response = await api.post('/api/appointments', {
      requestId: appointmentData.requestId,
      date: appointmentData.date,
      startTime: appointmentData.startTime,
      endTime: appointmentData.endTime,
      location: appointmentData.location
    });
    
    console.log('✅ Rendez-vous créé dans la base de données:', response.data);
    return response.data;
  },

  getParentAppointments: async (parentId: string): Promise<Appointment[]> => {
    console.log(`🔄 Chargement des rendez-vous pour le parent ${parentId} depuis l'API backend`);
    
    // Appeler l'API backend pour récupérer les rendez-vous du parent
    const response = await api.get(`/api/appointments/parent/${parentId}`);
    console.log('✅ Rendez-vous reçus du backend:', response.data);
    
    return response.data;
  },

  getAppointmentsByTeacher: async (teacherId: string): Promise<Appointment[]> => {
    console.log(`🔄 Chargement des rendez-vous pour l'enseignant ${teacherId} depuis l'API backend`);
    
    // Appeler l'API backend pour récupérer les rendez-vous de l'enseignant
    const response = await api.get(`/api/appointments/teacher/${teacherId}`);
    console.log('✅ Rendez-vous de l\'enseignant reçus du backend:', response.data);
    
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId: string, status: 'completed' | 'cancelled'): Promise<Appointment> => {
    console.log(`🔄 Mise à jour du statut du rendez-vous ${appointmentId} vers '${status}' via l'API backend`);
    
    // Convertir appointmentId en number si nécessaire
    const appointmentIdNum = parseInt(appointmentId);
    if (isNaN(appointmentIdNum)) {
      throw new Error(`ID de rendez-vous invalide: ${appointmentId}`);
    }
    
    // Appeler l'API backend pour mettre à jour le statut
    const response = await api.put(`/api/appointments/${appointmentIdNum}/status`, {
      status: status.toUpperCase()
    });
    
    console.log('✅ Statut de rendez-vous mis à jour dans la base de données:', response.data);
    return response.data;
  },

  getAllRequests: async (): Promise<Request[]> => {
    console.log('🔄 Chargement de toutes les demandes depuis l\'API backend');
    
    // Appeler l'API backend pour récupérer toutes les demandes
    const response = await api.get('/api/requests');
    console.log('✅ Toutes les demandes reçues du backend:', response.data);
    
    return response.data;
  },

  getAllAppointments: async (): Promise<Appointment[]> => {
    console.log('🔄 Chargement de tous les rendez-vous depuis l\'API backend');
    
    // Appeler l'API backend pour récupérer tous les rendez-vous
    const response = await api.get('/api/appointments');
    console.log('✅ Tous les rendez-vous reçus du backend:', response.data);
    
    return response.data;
  },

  // Méthode pour réinitialiser les données (utile pour les tests)
  resetData: (): void => {
    localStorage.removeItem('tuteur-adom-requests');
    localStorage.removeItem('tuteur-adom-appointments');
  }
};

export default requestService;