package com.tuteurldom.dto;

public class AuthResponse {
    
    public UserDto user;
    public String token;
    
    public AuthResponse() {}
    
    public AuthResponse(UserDto user, String token) {
        this.user = user;
        this.token = token;
    }
} 