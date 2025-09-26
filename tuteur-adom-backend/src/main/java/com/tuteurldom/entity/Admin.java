package com.tuteurldom.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "admins")
public class Admin extends User {

    @Column(nullable = true)
    public String position;

    // Constructeurs
    public Admin() {
        super();
        this.role = UserRole.ADMIN;
    }

    public Admin(String email, String password, String firstName, String lastName, String position) {
        super(email, password, firstName, lastName, UserRole.ADMIN);
        this.position = position;
    }
} 