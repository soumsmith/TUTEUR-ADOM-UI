package com.tuteurldom.resource;

import com.tuteurldom.entity.*;
import com.tuteurldom.repository.*;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.HashMap;
import java.util.Map;

@Path("/api/admin/stats")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminStatsResource {

    @Inject
    TeacherRepository teacherRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    RequestRepository requestRepository;

    @Inject
    AppointmentRepository appointmentRepository;

    @GET
    public Response getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();

        // Statistiques des enseignants
        long activeTeachers = teacherRepository.count("status", Teacher.TeacherStatus.ACTIVE);
        long pendingTeachers = teacherRepository.count("status", Teacher.TeacherStatus.PENDING);
        long suspendedTeachers = teacherRepository.count("status", Teacher.TeacherStatus.SUSPENDED);

        // Statistiques des parents (utilisateurs avec le rôle PARENT)
        long totalParents = userRepository.count("role", User.UserRole.PARENT);

        // Statistiques des demandes
        long pendingRequests = requestRepository.count("status", Request.RequestStatus.PENDING);
        long approvedRequests = requestRepository.count("status", Request.RequestStatus.APPROVED);
        long rejectedRequests = requestRepository.count("status", Request.RequestStatus.REJECTED);

        // Statistiques des rendez-vous
        long scheduledAppointments = appointmentRepository.count("status", Appointment.AppointmentStatus.SCHEDULED);
        long completedAppointments = appointmentRepository.count("status", Appointment.AppointmentStatus.COMPLETED);
        long cancelledAppointments = appointmentRepository.count("status", Appointment.AppointmentStatus.CANCELLED);

        // Enseignants
        stats.put("teachers", Map.of(
            "active", activeTeachers,
            "pending", pendingTeachers,
            "suspended", suspendedTeachers,
            "total", activeTeachers + pendingTeachers + suspendedTeachers
        ));

        // Parents
        stats.put("parents", Map.of(
            "total", totalParents
        ));

        // Demandes
        stats.put("requests", Map.of(
            "pending", pendingRequests,
            "approved", approvedRequests,
            "rejected", rejectedRequests,
            "total", pendingRequests + approvedRequests + rejectedRequests
        ));

        // Rendez-vous
        stats.put("appointments", Map.of(
            "scheduled", scheduledAppointments,
            "completed", completedAppointments,
            "cancelled", cancelledAppointments,
            "total", scheduledAppointments + completedAppointments + cancelledAppointments
        ));

        return Response.ok(stats).build();
    }
} 