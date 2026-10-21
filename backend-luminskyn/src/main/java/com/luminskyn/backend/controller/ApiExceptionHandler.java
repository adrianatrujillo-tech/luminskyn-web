package com.luminskyn.backend.controller;

import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(ResponseStatusException.class)
  ResponseEntity<?> estado(ResponseStatusException e) {
    return ResponseEntity.status(e.getStatusCode())
        .body(Map.of("message", e.getReason() == null ? "Solicitud inválida." : e.getReason()));
  }

  @ExceptionHandler({
    MethodArgumentNotValidException.class,
    HttpMessageNotReadableException.class,
    org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class
  })
  ResponseEntity<?> validacion(Exception e) {
    return ResponseEntity.badRequest()
        .body(Map.of("message", "Revisa los campos del formulario y las cantidades."));
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  ResponseEntity<?> duplicado(Exception e) {
    return ResponseEntity.status(409)
        .body(Map.of("message", "El registro ya existe. Actualiza la página antes de reintentar."));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<?> error(Exception e) {
    return ResponseEntity.status(500)
        .body(
            Map.of("message", "No se pudo completar la operación. Intenta nuevamente más tarde."));
  }
}
