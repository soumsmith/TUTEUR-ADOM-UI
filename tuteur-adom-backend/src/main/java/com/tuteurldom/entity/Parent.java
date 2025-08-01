package com.tuteurldom.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("PARENT")
public class Parent extends User {

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Child> children = new ArrayList<>();

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Request> requests = new ArrayList<>();

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    public List<Appointment> appointments = new ArrayList<>();

    // Constructeurs
    public Parent() {
        super();
        this.role = UserRole.PARENT;
    }

    public Parent(String email, String password, String firstName, String lastName) {
        super(email, password, firstName, lastName, UserRole.PARENT);
    }

    // Méthodes utilitaires
    public void addChild(Child child) {
        children.add(child);
        child.parent = this;
    }

    public void removeChild(Child child) {
        children.remove(child);
        child.parent = null;
    }
} 