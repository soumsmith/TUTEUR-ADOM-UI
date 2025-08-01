package com.tuteurldom.resource;

import com.tuteurldom.dto.TeacherDto;
import com.tuteurldom.entity.Teacher;
import com.tuteurldom.repository.TeacherRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Path("/api/teachers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TeacherResource {

    @Inject
    TeacherRepository teacherRepository;

    @GET
    public Response getAllTeachers(@QueryParam("subject") String subject,
                                  @QueryParam("minHourlyRate") BigDecimal minRate,
                                  @QueryParam("maxHourlyRate") BigDecimal maxRate,
                                  @QueryParam("location") String location) {
        
        Teacher.TeachingLocation teachingLocation = null;
        if (location != null) {
            try {
                teachingLocation = Teacher.TeachingLocation.valueOf(location.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Location invalide, ignorer le filtre
            }
        }

        List<Teacher> teachers = teacherRepository.findWithFilters(subject, minRate, maxRate, teachingLocation);
        List<TeacherDto> teacherDtos = teachers.stream()
                .map(TeacherDto::new)
                .collect(Collectors.toList());

        return Response.ok(teacherDtos).build();
    }

    @GET
    @Path("/{id}")
    public Response getTeacherById(@PathParam("id") Long id) {
        Optional<Teacher> teacherOpt = teacherRepository.findByIdOptional(id);
        
        if (teacherOpt.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Enseignant non trouvé")
                    .build();
        }

        TeacherDto teacherDto = new TeacherDto(teacherOpt.get());
        return Response.ok(teacherDto).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateTeacher(@PathParam("id") Long id, UpdateTeacherRequest request) {
        Optional<Teacher> teacherOpt = teacherRepository.findByIdOptional(id);
        
        if (teacherOpt.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Enseignant non trouvé")
                    .build();
        }

        Teacher teacher = teacherOpt.get();
        
        if (request.firstName != null) teacher.firstName = request.firstName;
        if (request.lastName != null) teacher.lastName = request.lastName;
        if (request.subject != null) teacher.subject = request.subject;
        if (request.hourlyRate != null) teacher.hourlyRate = request.hourlyRate;
        if (request.skills != null) teacher.skills = request.skills;
        if (request.bio != null) teacher.bio = request.bio;
        if (request.cvUrl != null) teacher.cvUrl = request.cvUrl;

        teacher.persist();

        TeacherDto teacherDto = new TeacherDto(teacher);
        return Response.ok(teacherDto).build();
    }

    @PUT
    @Path("/{id}/status")
    @Transactional
    public Response updateTeacherStatus(@PathParam("id") Long id, UpdateStatusRequest request) {
        Optional<Teacher> teacherOpt = teacherRepository.findByIdOptional(id);
        
        if (teacherOpt.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Enseignant non trouvé")
                    .build();
        }

        Teacher teacher = teacherOpt.get();
        
        try {
            teacher.status = Teacher.TeacherStatus.valueOf(request.status.toUpperCase());
            teacher.persist();
            
            TeacherDto teacherDto = new TeacherDto(teacher);
            return Response.ok(teacherDto).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Statut invalide")
                    .build();
        }
    }

    // DTOs pour les requêtes de mise à jour
    public static class UpdateTeacherRequest {
        public String firstName;
        public String lastName;
        public String subject;
        public BigDecimal hourlyRate;
        public String skills;
        public String bio;
        public String cvUrl;
    }

    public static class UpdateStatusRequest {
        public String status;
    }
} 