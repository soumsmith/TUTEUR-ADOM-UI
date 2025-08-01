export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'parent' | 'teacher' | 'admin';
  profilePicture?: string;
}

export interface Teacher extends User {
  role: 'teacher';
  subject: string;
  hourlyRate: number;
  teachingLocation: TeachingLocation[];
  skills: string;
  bio: string;
  cv?: string; // URL du CV ou contenu
  status?: 'pending' | 'active' | 'suspended';
  rating: number;
  reviews: Review[];
  profilePicture?: string;
}

export interface Parent extends User {
  children?: {
    name: string;
    age: number;
    grade: string;
  }[];
}

export interface Admin extends User {
  position: string;
}

export enum TeachingLocation {
  ONLINE = 'En ligne',
  HOME = 'À domicile',
  TEACHER_PLACE = 'Chez l\'enseignant',
}

export interface Course {
  id: string;
  teacherId: string;
  subject: string;
  description: string;
  hourlyRate: number;
  locations: TeachingLocation[];
  createdAt: string;
}

export interface Review {
  id: string;
  parentId: string;
  teacherId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Request {
  id: string;
  parentId: string;
  teacherId: string;
  courseId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  requestId: string;
  parentId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: TeachingLocation;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Availability {
  id: string;
  teacherId: string;
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 