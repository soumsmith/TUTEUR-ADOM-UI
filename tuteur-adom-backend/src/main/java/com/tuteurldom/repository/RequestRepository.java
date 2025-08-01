package com.tuteurldom.repository;

import com.tuteurldom.entity.Request;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class RequestRepository implements PanacheRepository<Request> {

    public List<Request> findByParentId(Long parentId) {
        return list("parent.id", parentId);
    }

    public List<Request> findByTeacherId(Long teacherId) {
        return list("teacher.id", teacherId);
    }

    public List<Request> findByStatus(Request.RequestStatus status) {
        return list("status", status);
    }

    public List<Request> findPendingRequests() {
        return list("status", Request.RequestStatus.PENDING);
    }
} 