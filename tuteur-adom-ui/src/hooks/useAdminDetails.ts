import { useState, useEffect } from 'react';
import teacherService from '../services/teacherService';
import courseService from '../services/courseService';
import parentService from '../services/parentService';
import type { Teacher, Course, Parent } from '../types';

interface AdminDetails {
  parent?: Parent;
  teacher?: Teacher;
  course?: Course;
  loading: boolean;
  error?: string;
}

export const useAdminDetails = (parentId?: string, teacherId?: string, courseId?: string): AdminDetails => {
  const [parent, setParent] = useState<Parent | undefined>();
  const [teacher, setTeacher] = useState<Teacher | undefined>();
  const [course, setCourse] = useState<Course | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!parentId && !teacherId && !courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(undefined);

        const promises: Promise<any>[] = [];
        
        if (parentId) {
          promises.push(
            parentService.getAllParents()
              .then(parents => parents.find(p => p.id === parentId))
              .catch(() => null)
          );
        } else {
          promises.push(Promise.resolve(null));
        }

        if (teacherId) {
          promises.push(
            teacherService.getTeacherById(teacherId).catch(() => null)
          );
        } else {
          promises.push(Promise.resolve(null));
        }

        if (courseId) {
          promises.push(
            courseService.getCourseById(courseId).catch(() => null)
          );
        } else {
          promises.push(Promise.resolve(null));
        }

        const [parentData, teacherData, courseData] = await Promise.all(promises);

        setParent(parentData || undefined);
        setTeacher(teacherData || undefined);
        setCourse(courseData || undefined);
      } catch (err) {
        console.error('Erreur lors du chargement des détails admin:', err);
        setError('Erreur lors du chargement des détails');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [parentId, teacherId, courseId]);

  return { parent, teacher, course, loading, error };
}; 