import type { Course } from '../types';
import { TeachingLocation } from '../types';
import { mockCourses as initialMockCourses } from './mockData';

interface CreateCourseData {
  subject: string;
  description: string;
  hourlyRate: number;
  locations: TeachingLocation[];
}

// Garder une copie en mémoire des cours
let inMemoryCourses = [...initialMockCourses];

const courseService = {
  createCourse: async (teacherId: string, data: CreateCourseData): Promise<Course> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Créer un nouveau cours avec des données mockées
    const newCourse: Course = {
      id: `c${Date.now()}`,
      teacherId,
      subject: data.subject,
      description: data.description,
      hourlyRate: data.hourlyRate,
      locations: data.locations,
      createdAt: new Date().toISOString()
    };

    // Ajouter le nouveau cours à la liste en mémoire
    inMemoryCourses.push(newCourse);

    return newCourse;
  },

  getCoursesByTeacher: async (teacherId: string): Promise<Course[]> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filtrer les cours en mémoire par teacherId
    return inMemoryCourses.filter(course => course.teacherId === teacherId);
  },

  updateCourse: async (courseId: string, data: Partial<Course>): Promise<Course> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Trouver le cours à mettre à jour
    const courseIndex = inMemoryCourses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      throw new Error('Cours non trouvé');
    }

    // Mettre à jour le cours
    const updatedCourse = {
      ...inMemoryCourses[courseIndex],
      ...data
    };

    // Remplacer l'ancien cours par le nouveau
    inMemoryCourses[courseIndex] = updatedCourse;

    return updatedCourse;
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Trouver l'index du cours à supprimer
    const courseIndex = inMemoryCourses.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      throw new Error('Cours non trouvé');
    }

    // Supprimer le cours de la liste en mémoire
    inMemoryCourses.splice(courseIndex, 1);
  }
};

export default courseService; 