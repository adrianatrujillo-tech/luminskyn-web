package com.luminskyn.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class Producto {
  @Id public Long id;

  @Column(nullable = false)
  public String nombre;

  @Column(nullable = false, precision = 12, scale = 2)
  public BigDecimal precio;

  public String imagen;
  public String categoria;

  @Column(length = 1000)
  public String descripcion;

  public boolean nuevo;
  public boolean oferta;
  public int stock;

  public Producto() {}

  public Producto(
      long id, String nombre, String precio, String categoria, String descripcion, boolean oferta) {
    this.id = id;
    this.nombre = nombre;
    this.precio = new BigDecimal(precio);
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.imagen = "assets/img/producto" + id + ".jpg";
    this.nuevo = id <= 4;
    this.oferta = oferta;
    this.stock = 50;
  }
}
