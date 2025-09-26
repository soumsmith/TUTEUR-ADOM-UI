package com.tuteurldom.resource;

import com.tuteurldom.dto.TeacherDto;
import com.tuteurldom.entity.Teacher;
import com.tuteurldom.repository.TeacherRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.InputStream;
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

    // Endpoints pour l'administration
    @GET
    @Path("/admin/pending")
    public Response getPendingTeachers() {
        List<Teacher> pendingTeachers = teacherRepository.findByStatus(Teacher.TeacherStatus.PENDING);
        List<TeacherDto> teacherDtos = pendingTeachers.stream()
                .map(TeacherDto::new)
                .collect(Collectors.toList());

        return Response.ok(teacherDtos).build();
    }

    @GET
    @Path("/admin/all")
    public Response getAllTeachersForAdmin(@QueryParam("status") String status) {
        List<Teacher> teachers;
        
        if (status != null) {
            try {
                Teacher.TeacherStatus teacherStatus = Teacher.TeacherStatus.valueOf(status.toUpperCase());
                teachers = teacherRepository.findByStatus(teacherStatus);
            } catch (IllegalArgumentException e) {
                teachers = teacherRepository.listAll();
            }
        } else {
            teachers = teacherRepository.listAll();
        }
        
        List<TeacherDto> teacherDtos = teachers.stream()
                .map(TeacherDto::new)
                .collect(Collectors.toList());

        return Response.ok(teacherDtos).build();
    }

    @GET
    @Path("/admin/stats")
    public Response getTeacherStats() {
        long activeTeachers = teacherRepository.count("status", Teacher.TeacherStatus.ACTIVE);
        long pendingTeachers = teacherRepository.count("status", Teacher.TeacherStatus.PENDING);
        long suspendedTeachers = teacherRepository.count("status", Teacher.TeacherStatus.SUSPENDED);
        long totalTeachers = teacherRepository.count();

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("activeTeachers", activeTeachers);
        stats.put("pendingTeachers", pendingTeachers);
        stats.put("suspendedTeachers", suspendedTeachers);
        stats.put("totalTeachers", totalTeachers);

        return Response.ok(stats).build();
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
            Teacher.TeacherStatus newStatus = Teacher.TeacherStatus.valueOf(request.status.toUpperCase());
            teacher.status = newStatus;
            teacher.persist();
            
            TeacherDto teacherDto = new TeacherDto(teacher);
            return Response.ok(teacherDto).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Statut invalide. Valeurs autorisées : PENDING, ACTIVE, SUSPENDED")
                    .build();
        }
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
        
        // Mise à jour des champs de base (User)
        if (request.firstName != null) teacher.firstName = request.firstName;
        if (request.lastName != null) teacher.lastName = request.lastName;
        if (request.profilePicture != null) teacher.profilePicture = request.profilePicture;
        
        // Mise à jour des champs spécifiques Teacher
        if (request.subject != null) teacher.subject = request.subject;
        if (request.hourlyRate != null) teacher.hourlyRate = request.hourlyRate;
        if (request.skills != null) teacher.skills = request.skills;
        if (request.bio != null) teacher.bio = request.bio;
        if (request.cvUrl != null) teacher.cvUrl = request.cvUrl;
        
        // Mise à jour des lieux d'enseignement
        if (request.teachingLocations != null && !request.teachingLocations.isEmpty()) {
            teacher.teachingLocations.clear();
            for (String location : request.teachingLocations) {
                try {
                    teacher.teachingLocations.add(Teacher.TeachingLocation.valueOf(location.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    // Ignorer les locations invalides
                }
            }
        }

        teacher.persist();

        TeacherDto teacherDto = new TeacherDto(teacher);
        return Response.ok(teacherDto).build();
    }

    // Pour l'instant, nous allons utiliser l'endpoint PUT existant avec base64
    // L'upload de fichiers multipart sera implémenté plus tard

    // DTOs pour les requêtes
    public static class UpdateStatusRequest {
        public String status;
    }

    public static class UpdateTeacherRequest {
        public String firstName;
        public String lastName;
        public String profilePicture;
        public String subject;
        public BigDecimal hourlyRate;
        public String skills;
        public String bio;
        public String cvUrl;
        public List<String> teachingLocations;
    }
} 