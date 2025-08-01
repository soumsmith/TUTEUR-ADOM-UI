package com.tuteurldom.resource;

import com.tuteurldom.dto.RequestDto;
import com.tuteurldom.entity.*;
import com.tuteurldom.repository.*;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Path("/api/requests")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RequestResource {

    @Inject
    RequestRepository requestRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    CourseRepository courseRepository;

    @POST
    @Transactional
    public Response createRequest(@Valid CreateRequestRequest request) {
        Optional<User> parentOpt = userRepository.findByIdOptional(request.parentId);
        Optional<User> teacherOpt = userRepository.findByIdOptional(request.teacherId);
        Optional<Course> courseOpt = courseRepository.findByIdOptional(request.courseId);

        if (parentOpt.isEmpty() || !(parentOpt.get() instanceof Parent)) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Parent non trouvé")
                    .build();
        }

        if (teacherOpt.isEmpty() || !(teacherOpt.get() instanceof Teacher)) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Enseignant non trouvé")
                    .build();
        }

        if (courseOpt.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Cours non trouvé")
                    .build();
        }

        Request newRequest = new Request(
                (Parent) parentOpt.get(),
                (Teacher) teacherOpt.get(),
                courseOpt.get(),
                request.message
        );

        newRequest.persist();

        RequestDto requestDto = new RequestDto(newRequest);
        return Response.status(Response.Status.CREATED).entity(requestDto).build();
    }

    @GET
    @Path("/parent/{parentId}")
    public Response getRequestsByParent(@PathParam("parentId") Long parentId) {
        List<Request> requests = requestRepository.findByParentId(parentId);
        List<RequestDto> requestDtos = requests.stream()
                .map(RequestDto::new)
                .collect(Collectors.toList());

        return Response.ok(requestDtos).build();
    }

    @GET
    @Path("/teacher/{teacherId}")
    public Response getRequestsByTeacher(@PathParam("teacherId") Long teacherId) {
        List<Request> requests = requestRepository.findByTeacherId(teacherId);
        List<RequestDto> requestDtos = requests.stream()
                .map(RequestDto::new)
                .collect(Collectors.toList());

        return Response.ok(requestDtos).build();
    }

    @GET
    @Path("/pending")
    public Response getPendingRequests() {
        List<Request> requests = requestRepository.findPendingRequests();
        List<RequestDto> requestDtos = requests.stream()
                .map(RequestDto::new)
                .collect(Collectors.toList());

        return Response.ok(requestDtos).build();
    }

    @PUT
    @Path("/{requestId}/status")
    @Transactional
    public Response updateRequestStatus(@PathParam("requestId") Long requestId, 
                                       UpdateStatusRequest request) {
        Optional<Request> requestOpt = requestRepository.findByIdOptional(requestId);
        
        if (requestOpt.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Demande non trouvée")
                    .build();
        }

        Request requestEntity = requestOpt.get();
        
        try {
            requestEntity.status = Request.RequestStatus.valueOf(request.status.toUpperCase());
            requestEntity.persist();
            
            RequestDto requestDto = new RequestDto(requestEntity);
            return Response.ok(requestDto).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Statut invalide")
                    .build();
        }
    }

    @GET
    public Response getAllRequests() {
        List<Request> requests = requestRepository.listAll();
        List<RequestDto> requestDtos = requests.stream()
                .map(RequestDto::new)
                .collect(Collectors.toList());

        return Response.ok(requestDtos).build();
    }

    // DTOs pour les requêtes
    public static class CreateRequestRequest {
        public Long parentId;
        public Long teacherId;
        public Long courseId;
        public String message;
    }

    public static class UpdateStatusRequest {
        public String status;
    }
} 