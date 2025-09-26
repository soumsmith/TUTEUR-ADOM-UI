import api from './api';
import type { User, Teacher, Admin, Parent } from '../types';
import { TeachingLocation } from '../types';
import { mockAdmin, mockTeachers } from './mockData';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterTeacherData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  subject: string;
  hourlyRate: number;
  teachingLocation: string[];
  skills: string;
  bio: string;
  cv?: string; // CV en base64
}

interface RegisterParentData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  children?: Array<{
    name: string;
    age: number;
    grade: string;
  }>;
}

interface AuthResponse {
  user: User;
  token: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (credentials.email === mockAdmin.email && credentials.password === 'admin123') {
      return {
        user: mockAdmin,
        token: 'mock-admin-token'
      };
    }
    
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  registerTeacher: async (data: RegisterTeacherData): Promise<AuthResponse> => {
    try {
      // Préparer les données pour le backend
      const registrationPayload = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        subject: data.subject,
        hourlyRate: data.hourlyRate,
        teachingLocation: data.teachingLocation, // Le backend attend teachingLocation
        skills: data.skills,
        bio: data.bio,
        cv: data.cv
      };

      console.log('🔄 Enregistrement enseignant vers API backend:', registrationPayload);
      
      // Appeler l'API backend
      const response = await api.post('/api/auth/register/teacher', registrationPayload);
      console.log('✅ Enseignant enregistré avec succès:', response.data);
      
      // Extraire les données de l'enseignant de la réponse
      const teacher = response.data.user || response.data;
      
      // S'assurer que les données sont dans le bon format
      const formattedTeacher: Teacher = {
        id: teacher.id,
        email: teacher.email,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        role: 'teacher',
        profilePicture: teacher.profilePicture,
        subject: teacher.subject,
        hourlyRate: teacher.hourlyRate,
        teachingLocations: teacher.teachingLocations || [],
        skills: teacher.skills,
        bio: teacher.bio,
        cv: teacher.cv,
        rating: teacher.rating || 0,
        status: teacher.status || 'PENDING', // Par défaut PENDING
        reviews: teacher.reviews || []
      };

      return {
        user: formattedTeacher,
        token: `mock-teacher-token-${Date.now()}`
      };
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement de l\'enseignant:', error);
      
      // Fallback vers le système mock en cas d'erreur API
      console.log('🔄 Fallback vers le système mock...');
      
      const newTeacher: Teacher = {
        id: Date.now().toString(), // ID temporaire
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'teacher',
        profilePicture: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        subject: data.subject,
        hourlyRate: data.hourlyRate,
        teachingLocations: data.teachingLocation as TeachingLocation[],
        skills: data.skills,
        bio: data.bio,
        cv: data.cv,
        rating: 0,
        status: 'PENDING', // Correction en majuscules
        reviews: []
      };

      // Ajouter à la liste des enseignants mockés
      const { addTeacher } = await import('./mockData');
      addTeacher(newTeacher);

      return {
        user: newTeacher,
        token: `mock-teacher-token-${Date.now()}`
      };
    }
  },

  registerParent: async (data: RegisterParentData): Promise<AuthResponse> => {
    // Appeler l'API backend réelle
    const response = await api.post<AuthResponse>('/api/auth/register/parent', {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      children: data.children || []
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, data);
    return response.data;
  },
};

export default authService; 