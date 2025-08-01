package com.tuteurldom.resource;

import com.tuteurldom.dto.*;
import com.tuteurldom.entity.*;
import com.tuteurldom.repository.UserRepository;
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

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    UserRepository userRepository;

    @POST
    @Path("/login")
    @Transactional
    public Response login(@Valid LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.email);
        
        if (userOpt.isEmpty()) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Email ou mot de passe incorrect")
                    .build();
        }
        
        User user = userOpt.get();
        
        // Dans un vrai projet, on utiliserait un hashage sécurisé
        if (!user.password.equals(request.password)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Email ou mot de passe incorrect")
                    .build();
        }

        // Générer un token JWT (simplifié pour la demo)
        String token = "mock-jwt-token-" + user.id;
        
        UserDto userDto = createUserDto(user);
        AuthResponse response = new AuthResponse(userDto, token);
        
        return Response.ok(response).build();
    }

    @POST
    @Path("/register/teacher")
    @Transactional
    public Response registerTeacher(@Valid RegisterTeacherRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Un utilisateur avec cet email existe déjà")
                    .build();
        }

        // Convertir les locations string en enum
        List<Teacher.TeachingLocation> locations = new ArrayList<>();
        for (String loc : request.teachingLocation) {
            try {
                locations.add(Teacher.TeachingLocation.valueOf(loc.toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Location invalide, continuer avec les autres
            }
        }

        Teacher teacher = new Teacher(
                request.email,
                request.password,
                request.firstName,
                request.lastName,
                request.subject,
                request.hourlyRate,
                locations,
                request.skills,
                request.bio
        );

        teacher.persist();

        String token = "mock-jwt-token-" + teacher.id;
        TeacherDto teacherDto = new TeacherDto(teacher);
        AuthResponse response = new AuthResponse(teacherDto, token);

        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @POST
    @Path("/register/parent")
    @Transactional
    public Response registerParent(@Valid RegisterParentRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Un utilisateur avec cet email existe déjà")
                    .build();
        }

        Parent parent = new Parent(
                request.email,
                request.password,
                request.firstName,
                request.lastName
        );

        parent.persist();

        // Ajouter les enfants s'il y en a
        if (request.children != null) {
            for (ChildInfo childInfo : request.children) {
                Child child = new Child(childInfo.name, childInfo.age, childInfo.grade, parent);
                child.persist();
                parent.children.add(child);
            }
        }

        String token = "mock-jwt-token-" + parent.id;
        UserDto parentDto = new UserDto(parent);
        AuthResponse response = new AuthResponse(parentDto, token);

        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    private UserDto createUserDto(User user) {
        if (user instanceof Teacher) {
            return new TeacherDto((Teacher) user);
        } else {
            return new UserDto(user);
        }
    }

    // DTOs pour les requêtes d'inscription
    public static class RegisterTeacherRequest {
        public String email;
        public String password;
        public String firstName;
        public String lastName;
        public String subject;
        public BigDecimal hourlyRate;
        public List<String> teachingLocation;
        public String skills;
        public String bio;
    }

    public static class RegisterParentRequest {
        public String email;
        public String password;
        public String firstName;
        public String lastName;
        public List<ChildInfo> children;
    }

    public static class ChildInfo {
        public String name;
        public Integer age;
        public String grade;
    }
} 