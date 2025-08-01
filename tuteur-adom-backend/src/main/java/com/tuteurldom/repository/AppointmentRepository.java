package com.tuteurldom.repository;

import com.tuteurldom.entity.Appointment;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class AppointmentRepository implements PanacheRepository<Appointment> {

    public List<Appointment> findByParentId(Long parentId) {
        return list("parent.id", parentId);
    }

    public List<Appointment> findByTeacherId(Long teacherId) {
        return list("teacher.id", teacherId);
    }

    public List<Appointment> findByStatus(Appointment.AppointmentStatus status) {
        return list("status", status);
    }

    public List<Appointment> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return list("date >= ?1 and date <= ?2", startDate, endDate);
    }

    public List<Appointment> findByTeacherAndDate(Long teacherId, LocalDate date) {
        return list("teacher.id = ?1 and date = ?2", teacherId, date);
    }
} 