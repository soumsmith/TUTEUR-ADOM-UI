package com.tuteurldom.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "requests")
public class Request extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    public Parent parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    public Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    public Course course;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public RequestStatus status = RequestStatus.PENDING;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    public String message;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Appointment> appointments = new ArrayList<>();

    // Constructeurs
    public Request() {
        this.createdAt = LocalDateTime.now();
    }

    public Request(Parent parent, Teacher teacher, Course course, String message) {
        this();
        this.parent = parent;
        this.teacher = teacher;
        this.course = course;
        this.message = message;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Enum pour le statut des demandes
    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }
} 