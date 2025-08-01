package com.tuteurldom.dto;

import com.tuteurldom.entity.Review;
import java.time.LocalDateTime;

public class ReviewDto {
    
    public String id;
    public String parentId;
    public String teacherId;
    public Integer rating;
    public String comment;
    public LocalDateTime createdAt;
    
    public ReviewDto() {}
    
    public ReviewDto(Review review) {
        this.id = review.id.toString();
        this.parentId = review.parent.id.toString();
        this.teacherId = review.teacher.id.toString();
        this.rating = review.rating;
        this.comment = review.comment;
        this.createdAt = review.createdAt;
    }
} 