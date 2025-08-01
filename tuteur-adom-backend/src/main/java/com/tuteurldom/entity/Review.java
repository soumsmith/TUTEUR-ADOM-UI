package com.tuteurldom.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    public Parent parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    public Teacher teacher;

    @NotNull
    @Min(1)
    @Max(5)
    @Column(nullable = false)
    public Integer rating;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    public String comment;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    // Constructeurs
    public Review() {
        this.createdAt = LocalDateTime.now();
    }

    public Review(Parent parent, Teacher teacher, Integer rating, String comment) {
        this();
        this.parent = parent;
        this.teacher = teacher;
        this.rating = rating;
        this.comment = comment;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
} 