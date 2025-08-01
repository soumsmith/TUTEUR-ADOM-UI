import api from './api';
import { TeachingLocation } from '../types';
import type { Teacher, Course, Availability } from '../types';

interface TeacherQueryParams {
  subject?: string;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  location?: string;
}

// Données fictives d'enseignants directement dans le service
const mockTeachers: Teacher[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@example.com',
    role: 'teacher',
    subject: 'Mathématiques',
    hourlyRate: 25,
    teachingLocation: [TeachingLocation.ONLINE, TeachingLocation.HOME],
    skills: 'Licence en mathématiques. 5 ans d\'expérience en enseignement.',
    bio: 'Passionnée par l\'enseignement des mathématiques.',
    rating: 4.7,
    reviews: [],
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '2',
    firstName: 'Thomas',
    lastName: 'Martin',
    email: 'thomas.martin@example.com',
    role: 'teacher',
    subject: 'Physique',
    hourlyRate: 30,
    teachingLocation: [TeachingLocation.ONLINE, TeachingLocation.TEACHER_PLACE],
    skills: 'Doctorat en physique. Enseignant en lycée depuis 8 ans.',
    bio: 'Ancien chercheur en physique, je me consacre désormais à l\'enseignement.',
    rating: 4.9,
    reviews: [],
    profilePicture: 'https://randomuser.me/api/portraits/men/46.jpg'
  }
];

// Données fictives de cours
const mockCourses: Course[] = [
  {
    id: '1001',
    teacherId: '1',
    subject: 'Mathématiques - Niveau Collège',
    description: 'Soutien scolaire en mathématiques pour les élèves de collège.',
    hourlyRate: 25,
    locations: [TeachingLocation.ONLINE, TeachingLocation.HOME],
    createdAt: new Date().toISOString()
  },
  {
    id: '1002',
    teacherId: '2',
    subject: 'Physique-Chimie - Lycée',
    description: 'Cours de physique-chimie pour lycéens.',
    hourlyRate: 30,
    locations: [TeachingLocation.ONLINE, TeachingLocation.TEACHER_PLACE],
    createdAt: new Date().toISOString()
  }
];

const teacherService = {
  getAllTeachers: async (params?: TeacherQueryParams): Promise<Teacher[]> => {
    try {
      // Simuler un délai de réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("Utilisation des données mockées internes");
      
      // Filtrer les enseignants selon les paramètres
      let filteredTeachers = [...mockTeachers];
      
      if (params) {
        if (params.subject) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.subject.toLowerCase().includes(params.subject?.toLowerCase() || '')
          );
        }
        
        if (params.minHourlyRate !== undefined) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.hourlyRate >= params.minHourlyRate!
          );
        }
        
        if (params.maxHourlyRate !== undefined) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.hourlyRate <= params.maxHourlyRate!
          );
        }
        
        if (params.location) {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.teachingLocation.includes(params.location as any)
          );
        }
      }
      
      console.log("Enseignants filtrés:", filteredTeachers.length);
      return filteredTeachers;
    } catch (error) {
      console.error("Erreur dans getAllTeachers:", error);
      throw error;
    }
  },

  getTeacherById: async (id: string): Promise<Teacher> => {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const teacher = mockTeachers.find(t => t.id === id);
    if (!teacher) {
      throw new Error('Enseignant non trouvé');
    }
    return teacher;
  },

  createCourse: async (teacherId: string, courseData: Omit<Course, 'id' | 'teacherId' | 'createdAt'>): Promise<Course> => {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newCourse = {
      id: Math.random().toString(36).substring(2, 15),
      teacherId,
      ...courseData,
      createdAt: new Date().toISOString(),
      locations: [],
    };
    
    return newCourse as Course;
  },

  getCoursesByTeacher: async (teacherId: string): Promise<Course[]> => {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockCourses.filter(course => course.teacherId === teacherId);
  },

  updateCourse: async (teacherId: string, courseId: string, courseData: Partial<Course>): Promise<Course> => {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const courseIndex = mockCourses.findIndex(c => c.id === courseId && c.teacherId === teacherId);
    if (courseIndex === -1) {
      throw new Error('Cours non trouvé');
    }
    
    // Dans une vraie application, nous mettrions à jour la base de données
    return {
      ...mockCourses[courseIndex],
      ...courseData,
    };
  },

  deleteCourse: async (teacherId: string, courseId: string): Promise<void> => {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Dans une vraie application, nous supprimerions le cours de la base de données
  },

  setAvailability: async (teacherId: string, availabilityData: Omit<Availability, 'id' | 'teacherId'>[]): Promise<Availability[]> => {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simuler la création d'entrées de disponibilité
    const availabilities = availabilityData.map(data => ({
      id: Math.random().toString(36).substring(2, 15),
      teacherId,
      ...data,
    }));
    
    return availabilities as Availability[];
  },

  getAvailability: async (teacherId: string): Promise<Availability[]> => {
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Dans une vraie application, nous récupérerions les disponibilités de la base de données
    return [];
  },
};

export default teacherService; 