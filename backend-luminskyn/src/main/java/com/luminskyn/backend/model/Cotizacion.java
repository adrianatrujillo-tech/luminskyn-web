package com.luminskyn.backend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Cotizacion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  public String nombre;
  public String email;
  public String telefono;
  public String tipo;
  public String producto;
  public int cantidad;
  public String ciudad;

  @Column(length = 2000)
  public String mensaje;

  public Instant fecha = Instant.now();
  public String estado = "RECIBIDA";
}
