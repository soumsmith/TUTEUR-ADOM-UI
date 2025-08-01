package com.tuteurldom.dto;

import com.tuteurldom.entity.Course;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class CourseDto {
    
    public String id;
    public String teacherId;
    public String subject;
    public String description;
    public BigDecimal hourlyRate;
    public List<String> locations;
    public LocalDateTime createdAt;
    
    public CourseDto() {}
    
    public CourseDto(Course course) {
        this.id = course.id.toString();
        this.teacherId = course.teacher.id.toString();
        this.subject = course.subject;
        this.description = course.description;
        this.hourlyRate = course.hourlyRate;
        this.locations = course.locations.stream()
                .map(location -> location.label)
                .collect(Collectors.toList());
        this.createdAt = course.createdAt;
    }
} 