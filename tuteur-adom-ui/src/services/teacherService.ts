import api from './api';
import type { Teacher, Course, Availability } from '../types';
import { TeachingLocation } from '../types';
import { getMockTeachers, addTeacher, updateTeacher } from './mockData';

interface TeacherQueryParams {
  subject?: string;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  location?: string;
}

// localStorage supprimé - utilisation exclusive de la base de données via l'API

// Fonction pour charger les cours depuis le localStorage
const loadCoursesFromStorage = (): Course[] => {
  try {
    const stored = localStorage.getItem('tuteur-adom-courses');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des cours depuis le localStorage:', error);
    return [];
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

interface UpdateTeacherProfileData {
  firstName?: string;
  lastName?: string;
  subject?: string;
  hourlyRate?: number;
  teachingLocations?: TeachingLocation[];
  skills?: string;
  bio?: string;
  cv?: string;
  profilePicture?: string;
}

// Fonction pour transformer les données du backend
const transformTeacherData = (backendTeacher: any): Teacher => {
  // Fonction pour convertir les labels français en valeurs enum
  const mapLocationLabels = (locations: string[]): TeachingLocation[] => {
    console.log('🔍 Lieux reçus du backend:', locations);
    const locationMap: { [key: string]: TeachingLocation } = {
      'En ligne': TeachingLocation.ONLINE,
      'À domicile': TeachingLocation.HOME, 
      'Chez l\'enseignant': TeachingLocation.TEACHER_PLACE
    };
    
    const mappedLocations = locations.map(location => {
      const mapped = locationMap[location] || location as TeachingLocation;
      console.log(`🔀 Mapping: "${location}" -> "${mapped}"`);
      return mapped;
    });
    
    console.log('✅ Lieux après transformation:', mappedLocations);
    return mappedLocations;
  };

  const teachingLocations = mapLocationLabels(backendTeacher.teachingLocations || backendTeacher.teachingLocation || []);
  
  const transformedTeacher = {
    ...backendTeacher,
    // Transformer les lieux d'enseignement
    teachingLocations,
    // S'assurer que rating est un nombre
    rating: backendTeacher.rating ? Number(backendTeacher.rating) : 0,
    // S'assurer que reviews est un tableau
    reviews: backendTeacher.reviews || [],
    // S'assurer que status est en majuscules
    status: backendTeacher.status ? backendTeacher.status.toUpperCase() : 'PENDING',
    // Prioriser la vraie photo, sinon générer un avatar par défaut
    profilePicture: backendTeacher.profilePicture && backendTeacher.profilePicture.trim() !== '' 
      ? backendTeacher.profilePicture 
      : generateDefaultAvatar(backendTeacher.firstName, backendTeacher.lastName)
  } as Teacher;
  
  console.log('🎯 Enseignant transformé final:', {
    id: transformedTeacher.id,
    name: `${transformedTeacher.firstName} ${transformedTeacher.lastName}`,
    teachingLocations: transformedTeacher.teachingLocations
  });
  
  return transformedTeacher;
};

// Fonction pour générer un avatar par défaut
const generateDefaultAvatar = (firstName: string, lastName: string): string => {
  // Utiliser l'API dicebear pour générer des avatars cohérents
  const seed = `${firstName}-${lastName}`.toLowerCase();
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

// Fonction pour compresser une image et la convertir en base64
const compressImageToBase64 = (file: File, quality: number = 0.8, maxWidth: number = 1000): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculer les nouvelles dimensions en gardant le ratio
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      
      // Redimensionner le canvas
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Dessiner l'image redimensionnée
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convertir en base64 avec compression
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
    
    // Charger l'image depuis le fichier
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsDataURL(file);
  });
};

const teacherService = {
  getAllTeachers: async (params?: TeacherQueryParams): Promise<Teacher[]> => {
    console.log('🔄 Chargement des enseignants depuis l\'API backend avec filtres:', params);
    
    // Construire les paramètres de requête
    const queryParams = new URLSearchParams();
    if (params?.subject) {
      queryParams.append('subject', params.subject);
    }
    if (params?.minHourlyRate) {
      queryParams.append('minHourlyRate', params.minHourlyRate.toString());
    }
    if (params?.maxHourlyRate) {
      queryParams.append('maxHourlyRate', params.maxHourlyRate.toString());
    }
    if (params?.location) {
      queryParams.append('location', params.location);
    }
    
    // Construire l'URL avec les paramètres
    const url = `/api/teachers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('📡 URL finale:', url);
    
    // Appeler l'API backend pour récupérer les enseignants
    const response = await api.get(url);
    console.log('✅ Enseignants reçus du backend:', response.data);
    
    return response.data;
  },

  getTeacherById: async (id: string): Promise<Teacher> => {
    try {
      console.log('🔄 Chargement de l\'enseignant depuis l\'API backend:', id);
      
      // Appeler l'API backend pour récupérer l'enseignant
      const response = await api.get(`/api/teachers/${id}`);
      console.log('✅ Enseignant reçu du backend:', response.data);
      
      // Retourner directement les données pour l'instant (sans transformation complexe)
      const teacher = {
        ...response.data,
        teachingLocations: response.data.teachingLocations || [],
        rating: response.data.rating ? Number(response.data.rating) : 0,
        reviews: response.data.reviews || [],
        status: response.data.status || 'PENDING',
        cv: response.data.cvUrl // Mapper cvUrl du backend vers cv pour le frontend
      } as Teacher;
      
      console.log('✅ Enseignant transformé:', teacher);
      return teacher;
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement depuis l\'API:', error);
      
      // Ne plus utiliser localStorage, relancer l'erreur pour forcer l'utilisation de la base de données
      throw new Error('Impossible de charger l\'enseignant depuis la base de données. Vérifiez que le serveur backend est accessible.');
    }
  },

  updateTeacherProfile: async (teacherId: string, data: UpdateTeacherProfileData): Promise<Teacher> => {
    try {
      // Préparer les données pour l'API backend
      const updateData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        subject: data.subject,
        hourlyRate: data.hourlyRate,
        skills: data.skills,
        bio: data.bio,
        teachingLocations: data.teachingLocations
      };

      // Ajouter la photo de profil si elle est fournie (en base64)
      if (data.profilePicture) {
        updateData.profilePicture = data.profilePicture;
      }

      // Ajouter le CV si fourni
      if (data.cv) {
        updateData.cvUrl = data.cv;
      }

      // Appel API backend réel
      const response = await api.put<Teacher>(`/api/teachers/${teacherId}`, updateData);

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      
      // Ne plus utiliser localStorage, relancer l'erreur pour forcer l'utilisation de la base de données
      throw new Error('Impossible de mettre à jour le profil dans la base de données. Vérifiez que le serveur backend est accessible.');
    }
  },

  uploadCV: async (teacherId: string, cvFile: File): Promise<string> => {
    try {
      // Simuler le traitement du fichier en base64
      const reader = new FileReader();
      const cvBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(cvFile);
      });

      // Mettre à jour le profil de l'enseignant avec le CV via l'API backend
      const response = await api.put(`/api/teachers/${teacherId}`, {
        cvUrl: cvBase64
      });

      // Retourner l'URL du CV depuis la réponse
      return response.data.cvUrl;
    } catch (error) {
      console.error('Erreur lors de l\'upload du CV:', error);
      throw new Error('Impossible d\'uploader le CV. Vérifiez que le serveur backend est accessible.');
    }
  },

  uploadProfilePicture: async (teacherId: string, imageFile: File): Promise<string> => {
    try {
      // Compresser et convertir l'image en base64
      const compressedBase64 = await compressImageToBase64(imageFile, 0.7, 800); // 70% qualité, max 800px
      
      // Utiliser l'endpoint PUT existant
      const response = await api.put(`/api/teachers/${teacherId}`, {
        profilePicture: compressedBase64
      });

      // Retourner l'URL de la photo depuis la réponse
      return response.data.profilePicture;
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error);
      throw new Error('Impossible d\'uploader la photo. Vérifiez que le serveur backend est accessible.');
    }
  },

  createCourse: async (teacherId: string, courseData: Omit<Course, 'id' | 'teacherId' | 'createdAt'>): Promise<Course> => {
    try {
      const response = await api.post<Course>(`/teachers/${teacherId}/courses`, courseData);
      
      // Sauvegarder le cours dans le localStorage
      const courses = loadCoursesFromStorage();
      courses.push(response.data);
      saveCoursesToStorage(courses);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du cours:', error);
      
      // Fallback : créer le cours localement
      const newCourse: Course = {
        id: `c${Date.now()}`,
        teacherId,
        ...courseData,
        createdAt: new Date().toISOString()
      };
      
      const courses = loadCoursesFromStorage();
      courses.push(newCourse);
      saveCoursesToStorage(courses);
      
      return newCourse;
    }
  },

  updateCourse: async (teacherId: string, courseId: string, courseData: Partial<Course>): Promise<Course> => {
    try {
      const response = await api.put<Course>(`/teachers/${teacherId}/courses/${courseId}`, courseData);
      
      // Mettre à jour le cours dans le localStorage
      const courses = loadCoursesFromStorage();
      const updatedCourses = courses.map(course => 
        course.id === courseId ? { ...course, ...response.data } : course
      );
      saveCoursesToStorage(updatedCourses);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du cours:', error);
      
      // Fallback : mettre à jour localement
      const courses = loadCoursesFromStorage();
      const updatedCourses = courses.map(course => 
        course.id === courseId ? { ...course, ...courseData } : course
      );
      saveCoursesToStorage(updatedCourses);
      
      return updatedCourses.find(course => course.id === courseId)!;
    }
  },

  deleteCourse: async (teacherId: string, courseId: string): Promise<void> => {
    try {
      await api.delete(`/teachers/${teacherId}/courses/${courseId}`);
      
      // Supprimer le cours du localStorage
      const courses = loadCoursesFromStorage();
      const courseIndex = courses.findIndex(c => c.id === courseId);
      if (courseIndex !== -1) {
        courses.splice(courseIndex, 1);
        saveCoursesToStorage(courses);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du cours:', error);
      
      // Fallback : supprimer localement
      const courses = loadCoursesFromStorage();
      const courseIndex = courses.findIndex(c => c.id === courseId);
      if (courseIndex !== -1) {
        courses.splice(courseIndex, 1);
        saveCoursesToStorage(courses);
      }
    }
  },

  setAvailability: async (teacherId: string, availabilityData: Omit<Availability, 'id' | 'teacherId'>[]): Promise<Availability[]> => {
    const response = await api.post<Availability[]>(`/teachers/${teacherId}/availability`, availabilityData);
    return response.data;
  },

  getAvailability: async (teacherId: string): Promise<Availability[]> => {
    const response = await api.get<Availability[]>(`/teachers/${teacherId}/availability`);
    return response.data;
  },

  createTeacher: async (teacherData: Omit<Teacher, 'id' | 'rating' | 'reviews' | 'status'>): Promise<Teacher> => {
    // Note: Cette fonction devrait faire un appel API POST /api/teachers
    // Pour l'instant, on lance une erreur car l'endpoint n'est pas encore implémenté
    throw new Error('L\'ajout d\'enseignants via l\'API n\'est pas encore implémenté.');
  },

  // Méthode pour réinitialiser les données (plus nécessaire car on n'utilise plus localStorage)
  resetData: (): void => {
    console.log('resetData: Plus nécessaire car on utilise maintenant la base de données.');
  }
};

export default teacherService; 