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

// Garder une copie en mémoire des demandes et rendez-vous
let inMemoryRequests = [...mockRequests];
let inMemoryAppointments = [...mockAppointments];

const requestService = {
  createRequest: async (parentId: string, requestData: CreateRequestData): Promise<Request> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Créer une nouvelle demande avec des données mockées
    const newRequest: Request = {
      id: `r${Date.now()}`,
      parentId,
      teacherId: requestData.teacherId,
      courseId: requestData.courseId,
      status: 'pending',
      message: requestData.message,
      createdAt: new Date().toISOString()
    };

    // Ajouter la nouvelle demande à la liste en mémoire
    inMemoryRequests.push(newRequest);

    return newRequest;
  },

  getParentRequests: async (parentId: string): Promise<Request[]> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filtrer les demandes en mémoire par parentId
    return inMemoryRequests.filter(request => request.parentId === parentId);
  },

  getRequestsByTeacher: async (teacherId: string): Promise<Request[]> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filtrer les demandes en mémoire par teacherId
    return inMemoryRequests.filter(request => request.teacherId === teacherId);
  },

  updateRequestStatus: async (requestId: string, status: 'approved' | 'rejected'): Promise<Request> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Trouver la demande à mettre à jour
    const requestIndex = inMemoryRequests.findIndex(request => request.id === requestId);
    if (requestIndex === -1) {
      throw new Error('Demande non trouvée');
    }

    // Mettre à jour le statut
    const updatedRequest = {
      ...inMemoryRequests[requestIndex],
      status
    };

    // Remplacer l'ancienne demande par la nouvelle
    inMemoryRequests[requestIndex] = updatedRequest;

    return updatedRequest;
  },

  getAllPendingRequests: async (): Promise<Request[]> => {
    // Retourner toutes les demandes en attente
    return Promise.resolve(inMemoryRequests.filter(request => request.status === 'pending'));
  },

  // Services pour les rendez-vous
  createAppointment: async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Trouver la demande associée
    const request = inMemoryRequests.find(req => req.id === appointmentData.requestId);
    if (!request) {
      throw new Error('Demande non trouvée');
    }

    // Créer un nouveau rendez-vous avec des données mockées
    const newAppointment: Appointment = {
      id: `a${Date.now()}`,
      requestId: appointmentData.requestId,
      parentId: request.parentId,
      teacherId: request.teacherId,
      date: appointmentData.date,
      startTime: appointmentData.startTime,
      endTime: appointmentData.endTime,
      location: appointmentData.location,
      status: 'scheduled'
    };

    // Ajouter le nouveau rendez-vous à la liste en mémoire
    inMemoryAppointments.push(newAppointment);

    return newAppointment;
  },

  getParentAppointments: async (parentId: string): Promise<Appointment[]> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filtrer les rendez-vous en mémoire par parentId
    return inMemoryAppointments.filter(appointment => appointment.parentId === parentId);
  },

  getAppointmentsByTeacher: async (teacherId: string): Promise<Appointment[]> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filtrer les rendez-vous en mémoire par teacherId
    return inMemoryAppointments.filter(appointment => appointment.teacherId === teacherId);
  },

  updateAppointmentStatus: async (appointmentId: string, status: 'completed' | 'cancelled'): Promise<Appointment> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Trouver le rendez-vous à mettre à jour
    const appointmentIndex = inMemoryAppointments.findIndex(appointment => appointment.id === appointmentId);
    if (appointmentIndex === -1) {
      throw new Error('Rendez-vous non trouvé');
    }

    // Mettre à jour le statut
    const updatedAppointment = {
      ...inMemoryAppointments[appointmentIndex],
      status
    };

    // Remplacer l'ancien rendez-vous par le nouveau
    inMemoryAppointments[appointmentIndex] = updatedAppointment;

    return updatedAppointment;
  },

  getAllRequests: async (): Promise<Request[]> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 500));

    return inMemoryRequests;
  },

  getAllAppointments: async (): Promise<Appointment[]> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 500));

    return inMemoryAppointments;
  }
};

export default requestService;