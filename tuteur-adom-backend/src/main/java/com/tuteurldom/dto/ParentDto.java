package com.tuteurldom.dto;

import com.tuteurldom.entity.Parent;
import com.tuteurldom.entity.Child;
import java.util.List;
import java.util.stream.Collectors;

public class ParentDto {
    
    public String id;
    public String firstName;
    public String lastName;
    public String email;
    public String role;
    public String profilePicture;
    public String status;
    public List<ChildDto> children;
    
    public ParentDto() {}
    
    public ParentDto(Parent parent) {
        this.id = parent.id.toString();
        this.firstName = parent.firstName;
        this.lastName = parent.lastName;
        this.email = parent.email;
        this.role = parent.role.name().toLowerCase();
        this.profilePicture = parent.profilePicture;
        this.status = "active"; // Par défaut, tous les parents sont actifs
        
        // Mapper les enfants
        this.children = parent.children.stream()
                .map(ChildDto::new)
                .collect(Collectors.toList());
    }
    
    // Classe interne pour les enfants
    public static class ChildDto {
        public String id;
        public String name;
        public Integer age;
        public String grade;
        
        public ChildDto() {}
        
        public ChildDto(Child child) {
            this.id = child.id.toString();
            this.name = child.name;
            this.age = child.age;
            this.grade = child.grade;
        }
    }
} 