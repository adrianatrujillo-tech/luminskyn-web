package com.luminskyn.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.web.filter.OncePerRequestFilter;

/** Límite básico por dirección IP para las operaciones públicas de escritura. */
public class AuthRateLimitFilter extends OncePerRequestFilter {
  private record Ventana(long inicio, int intentos) {}

  private final ConcurrentHashMap<String, Ventana> ventanas = new ConcurrentHashMap<>();
  private static final long DURACION = 600_000;

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    return !"POST".equals(request.getMethod())
        || !(request.getRequestURI().startsWith("/api/auth/")
            || request.getRequestURI().equals("/api/cotizaciones")
            || request.getRequestURI().equals("/api/suscripciones"));
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    long ahora = System.currentTimeMillis();
    if (ventanas.size() >= 5000)
      ventanas.entrySet().removeIf(e -> ahora - e.getValue().inicio() >= DURACION);
    if (ventanas.size() >= 5000 && !ventanas.containsKey(request.getRemoteAddr())) {
      rechazar(response);
      return;
    }
    var ventana =
        ventanas.compute(
            request.getRemoteAddr(),
            (ip, previa) ->
                previa == null || ahora - previa.inicio() >= DURACION
                    ? new Ventana(ahora, 1)
                    : new Ventana(previa.inicio(), previa.intentos() + 1));
    if (ventana.intentos() > 60) {
      rechazar(response);
      return;
    }
    chain.doFilter(request, response);
  }

  private void rechazar(HttpServletResponse response) throws IOException {
    response.setStatus(429);
    response.setHeader("Retry-After", "600");
    response.setContentType("application/json;charset=UTF-8");
    response
        .getWriter()
        .write("{\"message\":\"Demasiados intentos. Espera unos minutos antes de reintentar.\"}");
  }
}
