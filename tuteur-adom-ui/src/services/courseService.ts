import type { Course } from '../types';
import { TeachingLocation } from '../types';
import { mockCourses as initialMockCourses } from './mockData';
import api from './api';

interface CreateCourseData {
  subject: string;
  description: string;
  hourlyRate: number;
  locations: TeachingLocation[];
}

// Configuration pour choisir entre localStorage et API
const USE_API = true; // Essayer l'API d'abord, puis localStorage en fallback

// Fonction pour charger les cours depuis le localStorage
const loadCoursesFromStorage = (): Course[] => {
  try {
    const stored = localStorage.getItem('tuteur-adom-courses');
    return stored ? JSON.parse(stored) : [...initialMockCourses];
  } catch (error) {
    console.error('Erreur lors du chargement des cours depuis le localStorage:', error);
    return [...initialMockCourses];
  }
};

// Fonction pour sauvegarder les cours dans le localStorage
const saveCoursesToStorage = (courses: Course[]): void => {
  try {
    localStorage.setItem('tuteur-adom-courses', JSON.stringify(courses));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des cours dans le localStorage:', error);
  }
};

const courseService = {
  createCourse: async (teacherId: string, data: CreateCourseData): Promise<Course> => {
    if (USE_API) {
      try {
        // Convertir teacherId string en number pour le backend
        const teacherIdNum = parseInt(teacherId);
        if (isNaN(teacherIdNum)) {
          throw new Error('ID enseignant invalide');
        }

        // Appel API backend avec les données correctes
        const response = await api.post<Course>(`/api/teachers/${teacherIdNum}/courses`, {
          subject: data.subject,
          description: data.description,
          hourlyRate: data.hourlyRate,
          locations: data.locations.map(loc => {
            // Convertir l'enum en string pour le backend
            switch (loc) {
              case TeachingLocation.ONLINE:
                return 'En ligne';
              case TeachingLocation.HOME:
                return 'À domicile';
              case TeachingLocation.TEACHER_PLACE:
                return 'Chez l\'enseignant';
              default:
                return 'En ligne';
            }
          })
        });

        return response.data;
      } catch (error) {
        console.error('Erreur API, utilisation du localStorage:', error);
        // Fallback vers localStorage
      }
    }

    // Utilisation du localStorage (par défaut ou en fallback)
    await new Promise(resolve => setTimeout(resolve, 500)); // Simuler délai réseau

    const newCourse: Course = {
      id: `c${Date.now()}`,
      teacherId,
      subject: data.subject,
      description: data.description,
      hourlyRate: data.hourlyRate,
      locations: data.locations,
      createdAt: new Date().toISOString()
    };

    const courses = loadCoursesFromStorage();
    courses.push(newCourse);
    saveCoursesToStorage(courses);

    return newCourse;
  },

  getCoursesByTeacher: async (teacherId: string): Promise<Course[]> => {
    console.log(`🔄 Chargement des cours pour l'enseignant ${teacherId} depuis l'API backend`);
    
    // Appeler l'API backend pour récupérer les cours de l'enseignant
    const response = await api.get(`/api/courses/by-teacher/${teacherId}`);
    console.log('✅ Cours reçus du backend:', response.data);
    
    return response.data;
  },

  getCourseById: async (courseId: string): Promise<Course | null> => {
    if (USE_API) {
      try {
        // Convertir courseId string en number pour le backend
        const courseIdNum = parseInt(courseId);
        if (isNaN(courseIdNum)) {
          throw new Error('ID cours invalide');
        }

        // Appel API backend
        const response = await api.get<Course>(`/api/courses/${courseIdNum}`);
        return response.data;
      } catch (error) {
        console.error('Erreur API, utilisation du localStorage:', error);
        // Fallback vers localStorage
      }
    }

    // Utilisation du localStorage (par défaut ou en fallback)
    await new Promise(resolve => setTimeout(resolve, 300)); // Simuler délai réseau

    const courses = loadCoursesFromStorage();
    const course = courses.find(course => course.id === courseId);
    return course || null;
  },

  updateCourse: async (courseId: string, data: Partial<Course>): Promise<Course> => {
    if (USE_API) {
      try {
        // Convertir courseId string en number pour le backend
        const courseIdNum = parseInt(courseId);
        if (isNaN(courseIdNum)) {
          throw new Error('ID cours invalide');
        }

        // Appel API backend
        const response = await api.put<Course>(`/api/courses/${courseIdNum}`, data);
        return response.data;
      } catch (error) {
        console.error('Erreur API, utilisation du localStorage:', error);
        // Fallback vers localStorage
      }
    }

    // Utilisation du localStorage (par défaut ou en fallback)
    await new Promise(resolve => setTimeout(resolve, 500)); // Simuler délai réseau

    const courses = loadCoursesFromStorage();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      throw new Error('Cours non trouvé');
    }

    const updatedCourse = {
      ...courses[courseIndex],
      ...data
    };

    courses[courseIndex] = updatedCourse;
    saveCoursesToStorage(courses);

    return updatedCourse;
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    if (USE_API) {
      try {
        // Convertir courseId string en number pour le backend
        const courseIdNum = parseInt(courseId);
        if (isNaN(courseIdNum)) {
          throw new Error('ID cours invalide');
        }

        // Appel API backend
        await api.delete(`/api/courses/${courseIdNum}`);
        return;
      } catch (error) {
        console.error('Erreur API, utilisation du localStorage:', error);
        // Fallback vers localStorage
      }
    }

    // Utilisation du localStorage (par défaut ou en fallback)
    await new Promise(resolve => setTimeout(resolve, 500)); // Simuler délai réseau

    const courses = loadCoursesFromStorage();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      throw new Error('Cours non trouvé');
    }

    courses.splice(courseIndex, 1);
    saveCoursesToStorage(courses);
  },

  // Méthode pour vérifier la connexion à l'API
  checkApiConnection: async (): Promise<boolean> => {
    try {
      await api.get('/api/health');
      return true;
    } catch (error) {
      console.error('API non accessible:', error);
      return false;
    }
  },

  // Méthode pour basculer entre localStorage et API
  setUseApi: (useApi: boolean): void => {
    // Cette méthode peut être appelée depuis la console pour tester
    (courseService as any).USE_API = useApi;
  },

  // Méthode pour réinitialiser les cours
  resetCourses: (): void => {
    const courses = [...initialMockCourses];
    saveCoursesToStorage(courses);
  }
};

export default courseService; 