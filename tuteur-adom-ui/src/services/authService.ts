import api from './api';
import type { User, Teacher, Admin, Parent } from '../types';
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
    
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  registerTeacher: async (data: RegisterTeacherData): Promise<AuthResponse> => {
    // Appeler l'API backend réelle
    const response = await api.post<AuthResponse>('/auth/register/teacher', {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      subject: data.subject,
      hourlyRate: data.hourlyRate,
      teachingLocation: data.teachingLocation,
      skills: data.skills,
      bio: data.bio
    });
    return response.data;
  },

  registerParent: async (data: RegisterParentData): Promise<AuthResponse> => {
    // Appeler l'API backend réelle
    const response = await api.post<AuthResponse>('/auth/register/parent', {
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
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, data);
    return response.data;
  },
};

export default authService; 