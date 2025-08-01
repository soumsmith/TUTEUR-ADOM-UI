package com.tuteurldom.repository;

import com.tuteurldom.entity.Teacher;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import java.math.BigDecimal;
import java.util.List;

@ApplicationScoped
public class TeacherRepository implements PanacheRepository<Teacher> {

    public List<Teacher> findByStatus(Teacher.TeacherStatus status) {
        return list("status", status);
    }

    public List<Teacher> findActiveTeachers() {
        return list("status", Teacher.TeacherStatus.ACTIVE);
    }

    public List<Teacher> findBySubject(String subject) {
        return list("lower(subject) like lower(?1)", "%" + subject + "%");
    }

    public List<Teacher> findByHourlyRateRange(BigDecimal minRate, BigDecimal maxRate) {
        return list("hourlyRate >= ?1 and hourlyRate <= ?2", minRate, maxRate);
    }

    public List<Teacher> findByLocation(Teacher.TeachingLocation location) {
        return list("?1 member of teachingLocations", location);
    }

    public List<Teacher> findWithFilters(String subject, BigDecimal minRate, BigDecimal maxRate, 
                                       Teacher.TeachingLocation location) {
        StringBuilder query = new StringBuilder("status = :status");
        Parameters params = Parameters.with("status", Teacher.TeacherStatus.ACTIVE);

        if (subject != null && !subject.trim().isEmpty()) {
            query.append(" and lower(subject) like lower(:subject)");
            params.and("subject", "%" + subject + "%");
        }

        if (minRate != null) {
            query.append(" and hourlyRate >= :minRate");
            params.and("minRate", minRate);
        }

        if (maxRate != null) {
            query.append(" and hourlyRate <= :maxRate");
            params.and("maxRate", maxRate);
        }

        if (location != null) {
            query.append(" and :location member of teachingLocations");
            params.and("location", location);
        }

        return list(query.toString(), params);
    }
} 