package com.tuteurldom.dto;

import com.tuteurldom.entity.User;

public class UserDto {
    
    public String id;
    public String email;
    public String firstName;
    public String lastName;
    public String role;
    public String profilePicture;
    
    public UserDto() {}
    
    public UserDto(User user) {
        this.id = user.id.toString();
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.role = user.role.name().toLowerCase();
        this.profilePicture = user.profilePicture;
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
} 