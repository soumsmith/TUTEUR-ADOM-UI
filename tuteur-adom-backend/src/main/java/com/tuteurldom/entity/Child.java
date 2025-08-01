package com.tuteurldom.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

@Entity
@Table(name = "children")
public class Child extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotBlank
    @Column(nullable = false)
    public String name;

    @NotNull
    @Min(3)
    @Column(nullable = false)
    public Integer age;

    @NotBlank
    @Column(nullable = false)
    public String grade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = false)
    public Parent parent;

    // Constructeurs
    public Child() {}

    public Child(String name, Integer age, String grade, Parent parent) {
        this.name = name;
        this.age = age;
        this.grade = grade;
        this.parent = parent;
    }
} 