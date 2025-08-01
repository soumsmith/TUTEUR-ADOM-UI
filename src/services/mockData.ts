import { TeachingLocation } from '../types';
import type { Teacher, Course } from '../types';

// Données fictives d'enseignants
export const mockTeachers: Teacher[] = [
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
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Bernard',
    email: 'sophie.bernard@example.com',
    subject: 'Français',
    hourlyRate: 22,
    teachingLocation: [TeachingLocation.HOME, TeachingLocation.TEACHER_PLACE],
    skills: 'Master en lettres modernes. Spécialiste en littérature française du XIXe siècle. Méthodologie de dissertation et commentaire.',
    bio: 'Professeure de français depuis 12 ans, j\'accompagne les élèves de tous niveaux. Mes méthodes sont basées sur la lecture analytique et l\'expression écrite.',
    rating: 4.5,
    role: 'teacher',
    reviews: [
      {
        id: '104',
        rating: 4,
        comment: 'Très bonne enseignante qui a aidé ma fille à progresser en expression écrite.',
        parentId: '204',
        teacherId: '3',
        createdAt: '2023-03-05T11:20:00Z'
      },
      {
        id: '105',
        rating: 5,
        comment: 'Sophie est une excellente pédagogue, mes enfants ont fait d\'énormes progrès.',
        parentId: '205',
        teacherId: '3',
        createdAt: '2023-07-18T09:30:00Z'
      }
    ],
    profilePicture: 'https://randomuser.me/api/portraits/women/22.jpg'
  },
  {
    id: '4',
    firstName: 'Lucas',
    lastName: 'Petit',
    email: 'lucas.petit@example.com',
    subject: 'Anglais',
    hourlyRate: 26,
    teachingLocation: [TeachingLocation.ONLINE],
    skills: 'Bilingue anglais-français. CELTA certification. Spécialisé dans la conversation et la préparation aux examens internationaux.',
    bio: 'Après avoir vécu 10 ans à Londres, je partage ma passion pour la langue et la culture anglaise avec mes élèves. Approche communicative et immersive.',
    rating: 4.6,
    role: 'teacher',
    reviews: [
      {
        id: '106',
        rating: 5,
        comment: 'Lucas a aidé mon fils à préparer son TOEFL avec succès.',
        parentId: '206',
        teacherId: '4',
        createdAt: '2023-02-28T13:15:00Z'
      }
    ],
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '5',
    firstName: 'Emma',
    lastName: 'Leroy',
    email: 'emma.leroy@example.com',
    subject: 'Histoire',
    hourlyRate: 24,
    teachingLocation: [TeachingLocation.ONLINE, TeachingLocation.HOME],
    skills: 'Master en histoire contemporaine. Expertise en méthodologie. Préparation au baccalauréat et aux concours.',
    bio: 'Passionnée d\'histoire, je transmets mon enthousiasme à travers mes cours. J\'utilise des documents variés et des méthodes interactives pour captiver l\'attention des élèves.',
    rating: 4.8,
    role: 'teacher',
    reviews: [
      {
        id: '107',
        rating: 5,
        comment: 'Emma a une façon passionnante d\'enseigner l\'histoire, ma fille adore ses cours.',
        parentId: '207',
        teacherId: '5',
        createdAt: '2023-05-02T15:45:00Z'
      },
      {
        id: '108',
        rating: 4,
        comment: 'Très bonne préparation au bac, méthode efficace.',
        parentId: '208',
        teacherId: '5',
        createdAt: '2023-06-14T10:00:00Z'
      }
    ],
    profilePicture: 'https://randomuser.me/api/portraits/women/65.jpg'
  }
];

// Données fictives de cours
export const mockCourses: Course[] = [
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
  },
  {
    id: '1003',
    teacherId: '3',
    subject: 'Français - Collège/Lycée',
    description: 'Cours de français, méthodologie de dissertation et commentaire de texte.',
    hourlyRate: 22
  },
  {
    id: '1004',
    teacherId: '4',
    subject: 'Anglais - Conversation',
    description: 'Cours de conversation en anglais pour améliorer son aisance à l\'oral.',
    hourlyRate: 26
  },
  {
    id: '1005',
    teacherId: '4',
    subject: 'Anglais - Préparation TOEFL/IELTS',
    description: 'Préparation aux examens internationaux d\'anglais (TOEFL, IELTS, Cambridge).',
    hourlyRate: 32
  },
  {
    id: '1006',
    teacherId: '5',
    subject: 'Histoire - Niveau lycée',
    description: 'Cours d\'histoire pour lycéens, préparation au baccalauréat.',
    hourlyRate: 24
  }
]; 