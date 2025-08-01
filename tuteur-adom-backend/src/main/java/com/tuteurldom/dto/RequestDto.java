package com.tuteurldom.dto;

import com.tuteurldom.entity.Request;
import java.time.LocalDateTime;

public class RequestDto {
    
    public String id;
    public String parentId;
    public String teacherId;
    public String courseId;
    public String status;
    public String message;
    public LocalDateTime createdAt;
    
    public RequestDto() {}
    
    public RequestDto(Request request) {
        this.id = request.id.toString();
        this.parentId = request.parent.id.toString();
        this.teacherId = request.teacher.id.toString();
        this.courseId = request.course.id.toString();
        this.status = request.status.name().toLowerCase();
        this.message = request.message;
        this.createdAt = request.createdAt;
    }
} 