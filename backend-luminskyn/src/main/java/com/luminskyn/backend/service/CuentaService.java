package com.luminskyn.backend.service;

import com.luminskyn.backend.model.Usuario;
import com.luminskyn.backend.repository.UsuarioRepository;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CuentaService {
  public record Perfil(Long id, String nombre, String email) {}

  private final UsuarioRepository repo;
  private final PasswordEncoder passwords;

  public CuentaService(UsuarioRepository repo, PasswordEncoder passwords) {
    this.repo = repo;
    this.passwords = passwords;
  }

  public Perfil registro(String nombre, String email, String password) {
    email = email.trim().toLowerCase(Locale.ROOT);
    nombre = nombre.trim();
    if (nombre.isBlank() || password.getBytes(StandardCharsets.UTF_8).length > 72)
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Revisa el nombre y usa una contraseña de hasta 72 bytes.");
    if (repo.findByEmail(email).isPresent())
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Ese correo ya está registrado.");
    var u = repo.save(new Usuario(nombre, email, passwords.encode(password)));
    return new Perfil(u.id, u.nombre, u.email);
  }

  public Perfil perfil(String email) {
    var u =
        repo.findByEmail(email)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Inicia sesión para continuar."));
    return new Perfil(u.id, u.nombre, u.email);
  }
}
