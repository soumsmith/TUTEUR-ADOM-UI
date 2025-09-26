package com.tuteurldom.resource;

import com.tuteurldom.dto.CourseDto;
import com.tuteurldom.entity.Course;
import com.tuteurldom.entity.Teacher;
import com.tuteurldom.repository.CourseRepository;
import com.tuteurldom.repository.TeacherRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CourseResource {

    @Inject
    CourseRepository courseRepository;

    @Inject
    TeacherRepository teacherRepository;

    @GET
    @Path("/health")
    public Response healthCheck() {
        return Response.ok("API Tuteur Adom - OK").build();
    }

    @POST
    @Path("/teachers/{teacherId}/courses")
    @Transactional
    public Response createCourse(@PathParam("teacherId") Long teacherId, 
                                @Valid CreateCourseRequest request) {
        Optional<Teacher> teacherOpt = teacherRepository.findByIdOptional(teacherId);
        
        if (teacherOpt.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Enseignant non trouvé")
                    .build();
        }

        Teacher teacher = teacherOpt.get();

        // Convertir les locations string en enum
        List<Teacher.TeachingLocation> locations = new ArrayList<>();
        for (String loc : request.locations) {
            try {
                // Convertir depuis le label vers l'enum
                Teacher.TeachingLocation location = null;
                for (Teacher.TeachingLocation tl : Teacher.TeachingLocation.values()) {
                    if (tl.label.equals(loc)) {
                        location = tl;
                        break;
                    }
                }
                if (location != null) {
                    locations.add(location);
                }
            } catch (Exception e) {
                // Location invalide, continuer avec les autres
            }
        }

        Course course = new Course(
                request.subject,
                request.description,
                request.hourlyRate,
                locations,
                teacher
        );

        course.persist();

        CourseDto courseDto = new CourseDto(course);
        return Response.status(Response.Status.CREATED).entity(courseDto).build();
    }

    @GET
    @Path("/courses/by-teacher/{teacherId}")
    public Response getCoursesByTeacher(@PathParam("teacherId") Long teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        List<CourseDto> courseDtos = courses.stream()
                .map(CourseDto::new)
                .collect(Collectors.toList());

        return Response.ok(courseDtos).build();
    }

    @GET
    @Path("/courses/{courseId}")
    public Response getCourseById(@PathParam("courseId") Long courseId) {
        Optional<Course> courseOpt = courseRepository.findByIdOptional(courseId);
        
        if (courseOpt.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Cours non trouvé")
                    .build();
        }

        Course course = courseOpt.get();
        CourseDto courseDto = new CourseDto(course);
        return Response.ok(courseDto).build();
    }

    @PUT
    @Path("/courses/{courseId}")
    @Transactional
    public Response updateCourse(@PathParam("courseId") Long courseId, 
                                UpdateCourseRequest request) {
        Optional<Course> courseOpt = courseRepository.findByIdOptional(courseId);
        
        if (courseOpt.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Cours non trouvé")
                    .build();
        }

        Course course = courseOpt.get();
        
        if (request.subject != null) course.subject = request.subject;
        if (request.description != null) course.description = request.description;
        if (request.hourlyRate != null) course.hourlyRate = request.hourlyRate;

        course.persist();

        CourseDto courseDto = new CourseDto(course);
        return Response.ok(courseDto).build();
    }

    @DELETE
    @Path("/courses/{courseId}")
    @Transactional
    public Response deleteCourse(@PathParam("courseId") Long courseId) {
        Optional<Course> courseOpt = courseRepository.findByIdOptional(courseId);
        
        if (courseOpt.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Cours non trouvé")
                    .build();
        }

        courseOpt.get().delete();
        return Response.noContent().build();
    }

    // DTOs pour les requêtes
    public static class CreateCourseRequest {
        public String subject;
        public String description;
        public BigDecimal hourlyRate;
        public List<String> locations;
    }

    public static class UpdateCourseRequest {
        public String subject;
        public String description;
        public BigDecimal hourlyRate;
    }
} 