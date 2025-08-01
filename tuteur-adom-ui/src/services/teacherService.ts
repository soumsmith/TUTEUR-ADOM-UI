import api from './api';
import type { Teacher, Course, Availability } from '../types';
import { TeachingLocation } from '../types';
import { mockTeachers } from './mockData';

interface TeacherQueryParams {
  subject?: string;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  location?: string;
}

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
    subject: 'Français - Niveau Lycée',
    description: 'Préparation au bac de français, aide à la rédaction.',
    hourlyRate: 22,
    locations: [TeachingLocation.ONLINE, TeachingLocation.TEACHER_PLACE],
    createdAt: new Date().toISOString()
  },
  {
    id: '1003',
    teacherId: '3',
    subject: 'Anglais - Tous niveaux',
    description: 'Conversation, préparation aux examens internationaux (TOEFL, IELTS).',
    hourlyRate: 28,
    locations: [TeachingLocation.ONLINE, TeachingLocation.HOME, TeachingLocation.TEACHER_PLACE],
    createdAt: new Date().toISOString()
  }
];

interface UpdateTeacherProfileData {
  firstName?: string;
  lastName?: string;
  subject?: string;
  hourlyRate?: number;
  teachingLocation?: TeachingLocation[];
  skills?: string;
  bio?: string;
  cv?: string;
}

const teacherService = {
  getAllTeachers: async (params?: TeacherQueryParams): Promise<Teacher[]> => {
    // Retourne les données mockées à la place des appels API
    try {
      console.log('Utilisation des données mockées:', mockTeachers);
      
      // Filtrage selon les paramètres reçus
      let filteredTeachers = [...mockTeachers];
      
      if (params) {
        if (params.subject) {
          filteredTeachers = filteredTeachers.filter(t => 
            t.subject.toLowerCase() === params.subject?.toLowerCase()
          );
        }
        
        if (params.minHourlyRate !== undefined) {
          filteredTeachers = filteredTeachers.filter(t => 
            t.hourlyRate >= params.minHourlyRate!
          );
        }
        
        if (params.maxHourlyRate !== undefined) {
          filteredTeachers = filteredTeachers.filter(t => 
            t.hourlyRate <= params.maxHourlyRate!
          );
        }
        
        if (params.location) {
          filteredTeachers = filteredTeachers.filter(t => 
            t.teachingLocation.some(loc => loc === params.location)
          );
        }
      }
      
      // Simulation d'une réponse asynchrone
      return new Promise(resolve => {
        setTimeout(() => resolve(filteredTeachers), 500);
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données mockées:', error);
      return [];
    }
  },

  getTeacherById: async (id: string): Promise<Teacher> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 500));

    const teacher = mockTeachers.find(t => t.id === id);
    if (!teacher) {
      throw new Error('Enseignant non trouvé');
    }
    return teacher;
  },

  updateTeacherProfile: async (teacherId: string, data: UpdateTeacherProfileData): Promise<Teacher> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Trouver l'enseignant dans les données mockées
    const teacherIndex = mockTeachers.findIndex(t => t.id === teacherId);
    if (teacherIndex === -1) {
      throw new Error('Enseignant non trouvé');
    }

    // Mettre à jour les données
    const updatedTeacher = {
      ...mockTeachers[teacherIndex],
      ...data
    };

    // Dans un environnement réel, nous ferions un appel API ici
    // await api.put(`/teachers/${teacherId}`, data);

    return updatedTeacher;
  },

  uploadCV: async (teacherId: string, cvFile: File): Promise<string> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simuler le traitement du fichier
    const reader = new FileReader();
    const cvUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(cvFile);
    });

    // Dans un environnement réel, nous ferions un appel API ici pour uploader le fichier
    // const response = await api.post(`/teachers/${teacherId}/cv`, formData);
    // return response.data.url;

    return cvUrl;
  },

  createCourse: async (teacherId: string, courseData: Omit<Course, 'id' | 'teacherId' | 'createdAt'>): Promise<Course> => {
    const response = await api.post<Course>(`/teachers/${teacherId}/courses`, courseData);
    return response.data;
  },

  getCoursesByTeacher: async (teacherId: string): Promise<Course[]> => {
    try {
      // Dans un environnement réel, on ferait un appel API
      // Mais ici, on filtre les cours mockés
      const filteredCourses = mockCourses.filter(course => course.teacherId === teacherId);
      
      // Simulation d'une réponse asynchrone
      return new Promise(resolve => {
        setTimeout(() => resolve(filteredCourses), 300);
      });
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
      return [];
    }
  },

  updateCourse: async (teacherId: string, courseId: string, courseData: Partial<Course>): Promise<Course> => {
    const response = await api.put<Course>(`/teachers/${teacherId}/courses/${courseId}`, courseData);
    return response.data;
  },

  deleteCourse: async (teacherId: string, courseId: string): Promise<void> => {
    await api.delete(`/teachers/${teacherId}/courses/${courseId}`);
  },

  setAvailability: async (teacherId: string, availabilityData: Omit<Availability, 'id' | 'teacherId'>[]): Promise<Availability[]> => {
    const response = await api.post<Availability[]>(`/teachers/${teacherId}/availability`, availabilityData);
    return response.data;
  },

  getAvailability: async (teacherId: string): Promise<Availability[]> => {
    const response = await api.get<Availability[]>(`/teachers/${teacherId}/availability`);
    return response.data;
  },
};

export default teacherService; 