package com.tuteurldom.repository;

import com.tuteurldom.entity.Parent;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class ParentRepository implements PanacheRepository<Parent> {

    public List<Parent> findAllParents() {
        return listAll();
    }

    public List<Parent> findActiveParents() {
        // Considérer tous les parents comme actifs par défaut
        // Si un système de statut est ajouté plus tard, cette méthode peut être mise à jour
        return findAllParents();
    }
} 