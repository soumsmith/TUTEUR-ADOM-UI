package com.tuteurldom.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    public Request request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    public Parent parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    public Teacher teacher;

    @NotNull
    @Column(nullable = false)
    public LocalDate date;

    @NotNull
    @Column(name = "start_time", nullable = false)
    public LocalTime startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    public LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Teacher.TeachingLocation location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public AppointmentStatus status = AppointmentStatus.SCHEDULED;

    // Constructeurs
    public Appointment() {}

    public Appointment(Request request, Parent parent, Teacher teacher,
                      LocalDate date, LocalTime startTime, LocalTime endTime,
                      Teacher.TeachingLocation location) {
        this.request = request;
        this.parent = parent;
        this.teacher = teacher;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
    }

    // Enum pour le statut des rendez-vous
    public enum AppointmentStatus {
        SCHEDULED, COMPLETED, CANCELLED
    }
} 