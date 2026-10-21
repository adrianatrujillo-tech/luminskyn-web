package com.luminskyn.backend.controller;

import com.luminskyn.backend.service.PedidoService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
  private final PedidoService service;

  public PedidoController(PedidoService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public PedidoService.Resumen crear(
      Principal p, @Valid @RequestBody PedidoService.Solicitud pedido) {
    return service.crear(p.getName(), pedido);
  }

  @GetMapping
  public List<PedidoService.Resumen> listar(Principal p) {
    return service.listar(p.getName());
  }
}
