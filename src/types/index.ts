// Types d'utilisateurs
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  PARENT = 'parent',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface Teacher extends User {
  subject: string;
  hourlyRate: number;
  teachingLocation: TeachingLocation[];
  skills: string;
  bio: string;
  rating?: number;
  reviews?: Review[];
  availability?: Availability[];
  profilePicture?: string;
}

export interface Parent extends User {
  children?: ChildData[];
}

export interface Admin extends User {
  // Propriétés spécifiques aux administrateurs si nécessaire
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
  locations?: TeachingLocation[];
  createdAt?: string;
}

export interface Review {
  id: string;
  teacherId: string;
  parentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ChildData {
  name: string;
  age: number;
  grade: string;
}

export interface Request {
  id: string;
  parentId: string;
  teacherId: string;
  courseId: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
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
  dayOfWeek: number; // 0 pour Dimanche, 1 pour Lundi, etc.
  startTime: string;
  endTime: string;
} 