package com.luminskyn.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class Usuario {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @Column(nullable = false, length = 80)
  public String nombre;

  @Column(nullable = false, length = 160)
  public String email;

  @Column(nullable = false, length = 100)
  public String passwordHash;

  public Usuario() {}

  public Usuario(String nombre, String email, String hash) {
    this.nombre = nombre;
    this.email = email;
    this.passwordHash = hash;
  }
}
