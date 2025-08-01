import type { Teacher, Course, Admin, Request, Appointment } from '../types';
import { TeachingLocation } from '../types';

// Données fictives d'administrateur
export const mockAdmin: Admin = {
  id: 'admin1',
  email: 'admin@tuteur-adom.com',
  firstName: 'Admin',
  lastName: 'System',
  role: 'admin',
  position: 'Administrateur Principal'
};

export const mockTeachers: Teacher[] = [
  {
    id: '1',
    email: 'sophie.martin@example.com',
    firstName: 'Sophie',
    lastName: 'Martin',
    role: 'teacher',
    profilePicture: 'https://randomuser.me/api/portraits/women/52.jpg',
    subject: 'Mathématiques',
    hourlyRate: 25,
    teachingLocation: [TeachingLocation.ONLINE, TeachingLocation.HOME],
    skills: 'Algèbre, Géométrie, Calcul différentiel, Préparation aux examens',
    bio: 'Enseignante expérimentée avec 10 ans d\'expérience dans l\'éducation. Spécialisée dans les mathématiques pour collège et lycée. Approche pédagogique adaptée à chaque élève.',
    cv: 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G',
    rating: 4.8,
    status: 'active',
    reviews: [
      {
        id: 'r1',
        parentId: 'p1',
        teacherId: '1',
        rating: 5,
        comment: 'Excellente enseignante, ma fille a progressé rapidement en mathématiques.',
        createdAt: '2023-04-12T10:30:00Z'
      }
    ]
  },
  {
    id: '2',
    email: 'thomas.dupont@example.com',
    firstName: 'Thomas',
    lastName: 'Dupont',
    role: 'teacher',
    profilePicture: 'https://randomuser.me/api/portraits/men/41.jpg',
    subject: 'Français',
    hourlyRate: 22,
    teachingLocation: [TeachingLocation.ONLINE, TeachingLocation.TEACHER_PLACE],
    skills: 'Grammaire, Orthographe, Rédaction, Littérature française',
    bio: 'Professeur de français passionné par la langue et la littérature. J\'adapte mes méthodes pédagogiques selon les besoins et le niveau de chaque élève.',
    cv: 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G',
    rating: 4.5,
    status: 'pending',
    reviews: [
      {
        id: 'r2',
        parentId: 'p2',
        teacherId: '2',
        rating: 4,
        comment: 'Très bon professeur, patient et méthodique.',
        createdAt: '2023-03-20T14:15:00Z'
      }
    ]
  },
  {
    id: '3',
    email: 'marie.blanc@example.com',
    firstName: 'Marie',
    lastName: 'Blanc',
    role: 'teacher',
    profilePicture: 'https://randomuser.me/api/portraits/women/33.jpg',
    subject: 'Anglais',
    hourlyRate: 28,
    teachingLocation: [TeachingLocation.ONLINE, TeachingLocation.HOME, TeachingLocation.TEACHER_PLACE],
    skills: 'Conversation, Grammaire anglaise, Préparation TOEFL/IELTS',
    bio: 'Professeure d\'anglais bilingue avec expérience internationale. Approche communicative et interactive pour un apprentissage efficace et agréable.',
    rating: 4.9,
    status: 'suspended',
    reviews: [
      {
        id: 'r3',
        parentId: 'p3',
        teacherId: '3',
        rating: 5,
        comment: 'Excellente méthode d\'enseignement, mon fils a fait d\'énormes progrès.',
        createdAt: '2023-05-05T09:45:00Z'
      }
    ]
  }
];

export const mockRequests: Request[] = [
  {
    id: 'req1',
    parentId: 'p1',
    teacherId: '1',
    courseId: 'c1',
    status: 'pending' as const,
    message: 'Je souhaiterais des cours de mathématiques pour ma fille en 5ème.',
    createdAt: '2024-03-15T10:30:00Z'
  },
  {
    id: 'req2',
    parentId: 'p2',
    teacherId: '2',
    courseId: 'c2',
    status: 'pending' as const,
    message: 'Mon fils a besoin d\'aide en français, particulièrement en grammaire.',
    createdAt: '2024-03-16T14:15:00Z'
  },
  {
    id: 'req3',
    parentId: 'p3',
    teacherId: '3',
    courseId: 'c3',
    status: 'pending' as const,
    message: 'Je recherche des cours d\'anglais pour préparer le TOEFL.',
    createdAt: '2024-03-17T09:45:00Z'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    requestId: 'req1',
    parentId: 'p1',
    teacherId: '1',
    date: '2024-03-20',
    startTime: '14:00',
    endTime: '15:30',
    location: TeachingLocation.ONLINE,
    status: 'scheduled'
  },
  {
    id: 'apt2',
    requestId: 'req2',
    parentId: 'p2',
    teacherId: '2',
    date: '2024-03-21',
    startTime: '16:00',
    endTime: '17:30',
    location: TeachingLocation.HOME,
    status: 'completed'
  },
  {
    id: 'apt3',
    requestId: 'req3',
    parentId: 'p3',
    teacherId: '3',
    date: '2024-03-22',
    startTime: '10:00',
    endTime: '11:30',
    location: TeachingLocation.TEACHER_PLACE,
    status: 'scheduled'
  }
];

export const mockCourses: Course[] = [
  {
    id: 'c1',
    teacherId: '1',
    subject: 'Mathématiques - Collège',
    description: 'Cours de mathématiques pour collégiens, tous niveaux.',
    hourlyRate: 25,
    locations: [TeachingLocation.ONLINE, TeachingLocation.HOME],
    createdAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 'c2',
    teacherId: '1',
    subject: 'Mathématiques - Lycée',
    description: 'Cours de mathématiques pour lycéens, préparation au bac.',
    hourlyRate: 30,
    locations: [TeachingLocation.ONLINE, TeachingLocation.HOME],
    createdAt: '2024-03-15T10:30:00Z'
  },
  {
    id: 'c3',
    teacherId: '2',
    subject: 'Physique-Chimie',
    description: 'Cours de physique-chimie tous niveaux.',
    hourlyRate: 28,
    locations: [TeachingLocation.ONLINE, TeachingLocation.TEACHER_PLACE],
    createdAt: '2024-03-16T09:00:00Z'
  }
]; 