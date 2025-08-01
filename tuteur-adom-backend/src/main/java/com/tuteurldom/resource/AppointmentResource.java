package com.tuteurldom.resource;

import com.tuteurldom.dto.AppointmentDto;
import com.tuteurldom.entity.*;
import com.tuteurldom.repository.*;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Path("/api/appointments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AppointmentResource {

    @Inject
    AppointmentRepository appointmentRepository;

    @Inject
    RequestRepository requestRepository;

    @POST
    @Transactional
    public Response createAppointment(@Valid CreateAppointmentRequest request) {
        Optional<Request> requestOpt = requestRepository.findByIdOptional(request.requestId);
        
        if (requestOpt.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Demande non trouvée")
                    .build();
        }

        Request requestEntity = requestOpt.get();

        // Convertir la location
        Teacher.TeachingLocation location = null;
        for (Teacher.TeachingLocation tl : Teacher.TeachingLocation.values()) {
            if (tl.label.equals(request.location)) {
                location = tl;
                break;
            }
        }

        if (location == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Lieu d'enseignement invalide")
                    .build();
        }

        Appointment appointment = new Appointment(
                requestEntity,
                requestEntity.parent,
                requestEntity.teacher,
                LocalDate.parse(request.date),
                LocalTime.parse(request.startTime),
                LocalTime.parse(request.endTime),
                location
        );

        appointment.persist();

        AppointmentDto appointmentDto = new AppointmentDto(appointment);
        return Response.status(Response.Status.CREATED).entity(appointmentDto).build();
    }

    @GET
    @Path("/parent/{parentId}")
    public Response getAppointmentsByParent(@PathParam("parentId") Long parentId) {
        List<Appointment> appointments = appointmentRepository.findByParentId(parentId);
        List<AppointmentDto> appointmentDtos = appointments.stream()
                .map(AppointmentDto::new)
                .collect(Collectors.toList());

        return Response.ok(appointmentDtos).build();
    }

    @GET
    @Path("/teacher/{teacherId}")
    public Response getAppointmentsByTeacher(@PathParam("teacherId") Long teacherId) {
        List<Appointment> appointments = appointmentRepository.findByTeacherId(teacherId);
        List<AppointmentDto> appointmentDtos = appointments.stream()
                .map(AppointmentDto::new)
                .collect(Collectors.toList());

        return Response.ok(appointmentDtos).build();
    }

    @PUT
    @Path("/{appointmentId}/status")
    @Transactional
    public Response updateAppointmentStatus(@PathParam("appointmentId") Long appointmentId, 
                                           UpdateStatusRequest request) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findByIdOptional(appointmentId);
        
        if (appointmentOpt.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Rendez-vous non trouvé")
                    .build();
        }

        Appointment appointment = appointmentOpt.get();
        
        try {
            appointment.status = Appointment.AppointmentStatus.valueOf(request.status.toUpperCase());
            appointment.persist();
            
            AppointmentDto appointmentDto = new AppointmentDto(appointment);
            return Response.ok(appointmentDto).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Statut invalide")
                    .build();
        }
    }

    @GET
    public Response getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.listAll();
        List<AppointmentDto> appointmentDtos = appointments.stream()
                .map(AppointmentDto::new)
                .collect(Collectors.toList());

        return Response.ok(appointmentDtos).build();
    }

    // DTOs pour les requêtes
    public static class CreateAppointmentRequest {
        public Long requestId;
        public String date;
        public String startTime;
        public String endTime;
        public String location;
    }

    public static class UpdateStatusRequest {
        public String status;
    }
} 