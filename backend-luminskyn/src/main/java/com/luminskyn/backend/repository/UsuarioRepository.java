package com.luminskyn.backend.repository;

import com.luminskyn.backend.model.Usuario;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
  Optional<Usuario> findByEmail(String email);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select u from Usuario u where u.email = :email")
  Optional<Usuario> lockByEmail(String email);
}
