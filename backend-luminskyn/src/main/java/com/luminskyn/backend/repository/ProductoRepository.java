package com.luminskyn.backend.repository;

import com.luminskyn.backend.model.Producto;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select p from Producto p where p.id = :id")
  Optional<Producto> lockById(Long id);
}
