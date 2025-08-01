package com.tuteurldom.dto;

import com.tuteurldom.entity.Appointment;
import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentDto {
    
    public String id;
    public String requestId;
    public String parentId;
    public String teacherId;
    public LocalDate date;
    public LocalTime startTime;
    public LocalTime endTime;
    public String location;
    public String status;
    
    public AppointmentDto() {}
    
    public AppointmentDto(Appointment appointment) {
        this.id = appointment.id.toString();
        this.requestId = appointment.request.id.toString();
        this.parentId = appointment.parent.id.toString();
        this.teacherId = appointment.teacher.id.toString();
        this.date = appointment.date;
        this.startTime = appointment.startTime;
        this.endTime = appointment.endTime;
        this.location = appointment.location.label;
        this.status = appointment.status.name().toLowerCase();
    }
} 