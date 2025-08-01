package com.tuteurldom.repository;

import com.tuteurldom.entity.Course;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class CourseRepository implements PanacheRepository<Course> {

    public List<Course> findByTeacherId(Long teacherId) {
        return list("teacher.id", teacherId);
    }

    public List<Course> findBySubject(String subject) {
        return list("lower(subject) like lower(?1)", "%" + subject + "%");
    }
} 