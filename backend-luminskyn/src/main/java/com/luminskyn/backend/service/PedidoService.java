package com.luminskyn.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.luminskyn.backend.model.*;
import com.luminskyn.backend.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PedidoService {
  public record Linea(
      @NotNull @Positive Long productoId, @NotNull @Min(1) @Max(99) Integer cantidad) {}

  public record Solicitud(
      @NotBlank @Pattern(regexp = "[0-9a-fA-F-]{36}") String clave,
      @NotBlank @Size(max = 80) String nombre,
      @NotBlank @Pattern(regexp = "[+0-9 ()-]{6,25}") String telefono,
      @NotBlank @Size(min = 8, max = 300) String direccion,
      @NotEmpty @Size(max = 30) List<@NotNull @Valid Linea> items) {}

  public record Detalle(Long productoId, String nombre, BigDecimal precio, int cantidad) {}

  public record Resumen(
      Long id,
      List<Detalle> items,
      BigDecimal total,
      Instant fecha,
      String nombre,
      String telefono,
      String direccion,
      String estado,
      String pago) {}

  private final PedidoRepository pedidos;
  private final ProductoRepository productos;
  private final UsuarioRepository usuarios;
  private final ObjectMapper json;

  public PedidoService(
      PedidoRepository pedidos,
      ProductoRepository productos,
      UsuarioRepository usuarios,
      ObjectMapper json) {
    this.pedidos = pedidos;
    this.productos = productos;
    this.usuarios = usuarios;
    this.json = json;
  }

  @Transactional
  public Resumen crear(String email, Solicitud r) {
    var usuario = usuarios.lockByEmail(email).orElseThrow();
    var anterior = pedidos.findByUsuarioIdAndClave(usuario.id, r.clave());
    if (anterior.isPresent()) return resumen(anterior.get());
    var cantidades = new TreeMap<Long, Integer>();
    for (var l : r.items()) cantidades.merge(l.productoId(), l.cantidad(), Integer::sum);
    var detalle = new ArrayList<Detalle>();
    var total = BigDecimal.ZERO;
    for (var e : cantidades.entrySet()) {
      var p =
          productos
              .lockById(e.getKey())
              .orElseThrow(
                  () ->
                      new ResponseStatusException(
                          HttpStatus.BAD_REQUEST, "Producto no disponible."));
      int cantidad = e.getValue();
      if (cantidad > 99 || cantidad > p.stock)
        throw new ResponseStatusException(
            HttpStatus.CONFLICT, "Stock insuficiente para " + p.nombre + ". Actualiza el carrito.");
      p.stock -= cantidad;
      detalle.add(new Detalle(p.id, p.nombre, p.precio, cantidad));
      total = total.add(p.precio.multiply(BigDecimal.valueOf(cantidad)));
    }
    var p = new Pedido();
    p.usuarioId = usuario.id;
    p.clave = r.clave();
    p.total = total;
    p.fecha = Instant.now();
    p.nombre = r.nombre().trim();
    p.telefono = r.telefono().trim();
    p.direccion = r.direccion().trim();
    p.estado = "PENDIENTE";
    p.pago = "CONTRA_ENTREGA";
    try {
      p.items = json.writeValueAsString(detalle);
    } catch (Exception e) {
      throw new IllegalStateException("No se pudo guardar el detalle", e);
    }
    return resumen(pedidos.save(p));
  }

  @Transactional(readOnly = true)
  public List<Resumen> listar(String email) {
    var u = usuarios.findByEmail(email).orElseThrow();
    return pedidos.findByUsuarioIdOrderByFechaDesc(u.id).stream().map(this::resumen).toList();
  }

  private Resumen resumen(Pedido p) {
    try {
      return new Resumen(
          p.id,
          json.readValue(p.items, new TypeReference<List<Detalle>>() {}),
          p.total,
          p.fecha,
          p.nombre,
          p.telefono,
          p.direccion,
          p.estado,
          p.pago);
    } catch (Exception e) {
      throw new IllegalStateException("No se pudo leer el pedido", e);
    }
  }
}
