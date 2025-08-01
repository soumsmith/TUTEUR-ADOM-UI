package com.tuteurldom.repository;

import com.tuteurldom.entity.User;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {

    public Optional<User> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }

    public boolean existsByEmail(String email) {
        return find("email", email).count() > 0;
    }

    public Optional<User> findByEmailAndRole(String email, User.UserRole role) {
        return find("email = ?1 and role = ?2", email, role).firstResultOptional();
    }
} 