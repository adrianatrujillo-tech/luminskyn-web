package com.luminskyn.backend.controller;

import com.luminskyn.backend.model.*;
import com.luminskyn.backend.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ContactoController {
  private final CotizacionRepository cotizaciones;
  private final SuscripcionRepository suscripciones;

  public ContactoController(CotizacionRepository c, SuscripcionRepository s) {
    cotizaciones = c;
    suscripciones = s;
  }

  public record Correo(
      @NotBlank @Email @Size(max = 160) String email, @AssertTrue boolean consentimiento) {}

  public record Consulta(
      @NotBlank @Size(max = 80) String nombre,
      @NotBlank @Email @Size(max = 160) String email,
      @NotBlank @Pattern(regexp = "[+0-9 ()-]{6,25}") String telefono,
      @NotBlank @Pattern(regexp = "individual|mayorista|empresa") String tipo,
      @NotBlank @Size(max = 160) String producto,
      @Min(1) @Max(10000) int cantidad,
      @NotBlank @Size(max = 100) String ciudad,
      @Size(max = 2000) String mensaje,
      @AssertTrue boolean consentimiento) {}

  @PostMapping("/suscripciones")
  public Map<String, String> suscribir(@Valid @RequestBody Correo r) {
    var email = r.email().trim().toLowerCase(Locale.ROOT);
    if (!suscripciones.existsByEmail(email)) {
      var s = new Suscripcion();
      s.email = email;
      suscripciones.save(s);
    }
    return Map.of("message", "Tu suscripción quedó registrada.");
  }

  @PostMapping("/cotizaciones")
  public Map<String, Object> cotizar(@Valid @RequestBody Consulta r) {
    var c = new Cotizacion();
    c.nombre = r.nombre().trim();
    c.email = r.email().trim().toLowerCase(Locale.ROOT);
    c.telefono = r.telefono();
    c.tipo = r.tipo();
    c.producto = r.producto().trim();
    c.cantidad = r.cantidad();
    c.ciudad = r.ciudad().trim();
    c.mensaje = r.mensaje();
    cotizaciones.save(c);
    return Map.of("id", c.id, "message", "Solicitud registrada. Guarda tu número de referencia.");
  }
}
