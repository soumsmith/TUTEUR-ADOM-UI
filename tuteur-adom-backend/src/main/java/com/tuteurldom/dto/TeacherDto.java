package com.tuteurldom.dto;

import com.tuteurldom.entity.Teacher;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class TeacherDto extends UserDto {
    
    public String subject;
    public BigDecimal hourlyRate;
    public List<String> teachingLocations;
    public String skills;
    public String bio;
    public String cvUrl;
    public String status;
    public BigDecimal rating;
    public List<ReviewDto> reviews;
    
    public TeacherDto() {
        super();
    }
    
    public TeacherDto(Teacher teacher) {
        super(teacher);
        this.subject = teacher.subject;
        this.hourlyRate = teacher.hourlyRate;
        this.teachingLocations = teacher.teachingLocations.stream()
                .map(location -> location.label)
                .collect(Collectors.toList());
        this.skills = teacher.skills;
        this.bio = teacher.bio;
        this.cvUrl = teacher.cvUrl;
        this.status = teacher.status.name().toLowerCase();
        this.rating = teacher.rating;
        this.reviews = teacher.reviews.stream()
                .map(ReviewDto::new)
                .collect(Collectors.toList());
    }
} 