import { useState, useEffect } from 'react';
import teacherService from '../services/teacherService';
import courseService from '../services/courseService';
import type { Teacher, Course } from '../types';

interface RequestDetails {
  teacher?: Teacher;
  course?: Course;
  loading: boolean;
  error?: string;
}

export const useRequestDetails = (teacherId: string, courseId: string): RequestDetails => {
  const [teacher, setTeacher] = useState<Teacher | undefined>();
  const [course, setCourse] = useState<Course | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!teacherId || !courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(undefined);

        // Récupérer les détails de l'enseignant et du cours en parallèle
        const [teacherData, courseData] = await Promise.all([
          teacherService.getTeacherById(teacherId).catch(() => null),
          courseService.getCourseById(courseId).catch(() => null)
        ]);

        setTeacher(teacherData || undefined);
        setCourse(courseData || undefined);
      } catch (err) {
        console.error('Erreur lors du chargement des détails de la demande:', err);
        setError('Erreur lors du chargement des détails');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [teacherId, courseId]);

  return { teacher, course, loading, error };
}; 