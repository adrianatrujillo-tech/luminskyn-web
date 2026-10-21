package com.luminskyn.backend.controller;

import com.luminskyn.backend.model.Producto;
import com.luminskyn.backend.repository.ProductoRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {
  private final ProductoRepository repo;

  public ProductoController(ProductoRepository repo) {
    this.repo = repo;
  }

  @GetMapping
  public List<Producto> listar() {
    return repo.findAll(Sort.by("id"));
  }

  @GetMapping("/{id}")
  public Producto obtener(@PathVariable Long id) {
    return repo.findById(id)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado."));
  }
}
