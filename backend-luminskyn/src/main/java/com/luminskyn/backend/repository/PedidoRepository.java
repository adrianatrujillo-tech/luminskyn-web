package com.luminskyn.backend.repository;

import com.luminskyn.backend.model.Pedido;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
  List<Pedido> findByUsuarioIdOrderByFechaDesc(Long usuarioId);

  Optional<Pedido> findByUsuarioIdAndClave(Long usuarioId, String clave);
}
