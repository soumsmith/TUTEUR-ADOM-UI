package com.tuteurldom.resource;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

@Path("/uploads")
public class StaticFilesResource {

    @GET
    @Path("/profile-pictures/{filename}")
    @Produces("image/*")
    public Response getProfilePicture(@PathParam("filename") String filename) {
        try {
            String filePath = "uploads/profile-pictures/" + filename;
            File file = new File(filePath);
            
            if (!file.exists()) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            
            FileInputStream fileInputStream = new FileInputStream(file);
            
            // Déterminer le type MIME basé sur l'extension
            String contentType = "image/jpeg"; // par défaut
            if (filename.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (filename.toLowerCase().endsWith(".gif")) {
                contentType = "image/gif";
            } else if (filename.toLowerCase().endsWith(".webp")) {
                contentType = "image/webp";
            }
            
            return Response.ok(fileInputStream, contentType).build();
            
        } catch (FileNotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erreur lors de la lecture du fichier")
                    .build();
        }
    }
} 