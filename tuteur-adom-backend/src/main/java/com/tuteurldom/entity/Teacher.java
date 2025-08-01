package com.tuteurldom.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("TEACHER")
public class Teacher extends User {

    @NotBlank
    @Column(nullable = false)
    public String subject;

    @NotNull
    @DecimalMin("0.0")
    @Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
    public BigDecimal hourlyRate;

    @ElementCollection(targetClass = TeachingLocation.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "teacher_locations", joinColumns = @JoinColumn(name = "teacher_id"))
    @Column(name = "location")
    public List<TeachingLocation> teachingLocations = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    public String skills;

    @Column(columnDefinition = "TEXT")
    public String bio;

    @Column(name = "cv_url")
    public String cvUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public TeacherStatus status = TeacherStatus.PENDING;

    @Column(precision = 3, scale = 2)
    public BigDecimal rating = BigDecimal.ZERO;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Course> courses = new ArrayList<>();

    // Constructeurs
    public Teacher() {
        super();
        this.role = UserRole.TEACHER;
    }

    public Teacher(String email, String password, String firstName, String lastName,
                   String subject, BigDecimal hourlyRate, List<TeachingLocation> teachingLocations,
                   String skills, String bio) {
        super(email, password, firstName, lastName, UserRole.TEACHER);
        this.subject = subject;
        this.hourlyRate = hourlyRate;
        this.teachingLocations = teachingLocations != null ? teachingLocations : new ArrayList<>();
        this.skills = skills;
        this.bio = bio;
    }

    // Enum pour les lieux d'enseignement
    public enum TeachingLocation {
        ONLINE("En ligne"),
        HOME("À domicile"),
        TEACHER_PLACE("Chez l'enseignant");

        public final String label;

        TeachingLocation(String label) {
            this.label = label;
        }
    }

    // Enum pour le statut du professeur
    public enum TeacherStatus {
        PENDING, ACTIVE, SUSPENDED
    }

    // Méthodes utilitaires
    public void updateRating() {
        if (reviews.isEmpty()) {
            this.rating = BigDecimal.ZERO;
        } else {
            double averageRating = reviews.stream()
                    .mapToInt(review -> review.rating)
                    .average()
                    .orElse(0.0);
            this.rating = BigDecimal.valueOf(averageRating);
        }
    }
} 