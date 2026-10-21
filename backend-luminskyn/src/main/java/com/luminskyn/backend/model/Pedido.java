package com.luminskyn.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "pedido", uniqueConstraints = @UniqueConstraint(columnNames = {"usuarioId", "clave"}))
public class Pedido {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @Column(columnDefinition = "TEXT")
  public String items;

  @Column(precision = 12, scale = 2)
  public BigDecimal total;

  public Long usuarioId;

  @Column(length = 36)
  public String clave;

  public Instant fecha;
  public String nombre;
  public String telefono;

  @Column(length = 300)
  public String direccion;

  public String estado;
  public String pago;
}
