package com.luminskyn.backend.repository;

import com.luminskyn.backend.model.Suscripcion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SuscripcionRepository extends JpaRepository<Suscripcion, Long> {
  boolean existsByEmail(String email);
}
