package com.luminskyn.backend.controller;

import com.luminskyn.backend.service.CuentaService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.security.Principal;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final CuentaService cuentas;

  public AuthController(CuentaService cuentas) {
    this.cuentas = cuentas;
  }

  public record Registro(
      @NotBlank @Size(max = 80) String nombre,
      @NotBlank @Email @Size(max = 160) String email,
      @NotNull @Size(min = 8, max = 72) String password) {
    public Registro {
      if (nombre != null) nombre = nombre.trim();
      if (email != null) email = email.trim();
    }
  }

  @GetMapping("/csrf")
  public Map<String, String> csrf(CsrfToken token) {
    return Map.of("token", token.getToken());
  }

  @PostMapping("/registro")
  @ResponseStatus(HttpStatus.CREATED)
  public CuentaService.Perfil registro(@Valid @RequestBody Registro r) {
    return cuentas.registro(r.nombre(), r.email(), r.password());
  }

  @GetMapping("/yo")
  public CuentaService.Perfil yo(Principal p) {
    return cuentas.perfil(p.getName());
  }
}
