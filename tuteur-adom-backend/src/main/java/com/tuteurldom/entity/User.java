package com.tuteurldom.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    public String email;

    @NotBlank
    @Size(min = 6)
    @Column(nullable = false)
    public String password;

    @NotBlank
    @Size(min = 2, max = 50)
    @Column(name = "first_name", nullable = false)
    public String firstName;

    @NotBlank
    @Size(min = 2, max = 50)
    @Column(name = "last_name", nullable = false)
    public String lastName;

    @Column(name = "profile_picture", columnDefinition = "LONGTEXT")
    public String profilePicture;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public UserRole role;

    // Constructeurs
    public User() {}

    public User(String email, String password, String firstName, String lastName, UserRole role) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    // Enum pour les rôles
    public enum UserRole {
        PARENT, TEACHER, ADMIN
    }

    // Méthodes utilitaires
    public String getFullName() {
        return firstName + " " + lastName;
    }
} 