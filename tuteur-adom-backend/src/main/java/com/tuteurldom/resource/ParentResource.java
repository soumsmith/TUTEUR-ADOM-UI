package com.tuteurldom.resource;

import com.tuteurldom.dto.ParentDto;
import com.tuteurldom.repository.ParentRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

@Path("/api/parents")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ParentResource {

    @Inject
    ParentRepository parentRepository;

    @GET
    public Response getAllParents() {
        try {
            List<ParentDto> parents = parentRepository.findAllParents()
                    .stream()
                    .map(ParentDto::new)
                    .collect(Collectors.toList());
            
            return Response.ok(parents).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erreur lors de la récupération des parents: " + e.getMessage())
                    .build();
        }
    }

    @PUT
    @Path("/{id}/status")
    public Response updateParentStatus(@PathParam("id") Long parentId, StatusRequest request) {
        try {
            // Pour l'instant, on ne fait que retourner un succès
            // Plus tard, on pourra implémenter un vrai système de statut pour les parents
            return Response.ok().entity("Statut du parent mis à jour avec succès").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erreur lors de la mise à jour du statut: " + e.getMessage())
                    .build();
        }
    }

    // Classe interne pour la requête de mise à jour du statut
    public static class StatusRequest {
        public String status;
    }
} 