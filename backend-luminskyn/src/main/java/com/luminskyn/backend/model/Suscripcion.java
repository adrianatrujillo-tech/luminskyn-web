package com.luminskyn.backend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Suscripcion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @Column(unique = true, nullable = false, length = 160)
  public String email;

  public Instant fecha = Instant.now();
}
