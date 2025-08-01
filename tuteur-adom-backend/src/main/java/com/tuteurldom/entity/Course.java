package com.tuteurldom.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotBlank
    @Column(nullable = false)
    public String subject;

    @Column(columnDefinition = "TEXT")
    public String description;

    @NotNull
    @DecimalMin("0.0")
    @Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
    public BigDecimal hourlyRate;

    @ElementCollection(targetClass = Teacher.TeachingLocation.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "course_locations", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "location")
    public List<Teacher.TeachingLocation> locations = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    public Teacher teacher;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Request> requests = new ArrayList<>();

    // Constructeurs
    public Course() {
        this.createdAt = LocalDateTime.now();
    }

    public Course(String subject, String description, BigDecimal hourlyRate,
                  List<Teacher.TeachingLocation> locations, Teacher teacher) {
        this();
        this.subject = subject;
        this.description = description;
        this.hourlyRate = hourlyRate;
        this.locations = locations != null ? locations : new ArrayList<>();
        this.teacher = teacher;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
} 