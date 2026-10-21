package com.luminskyn.backend;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.luminskyn.backend.repository.*;
import java.util.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BackendApplicationTests {
  @Autowired MockMvc mvc;
  @Autowired ObjectMapper json;
  @Autowired UsuarioRepository usuarios;
  @Autowired PedidoRepository pedidos;
  @Autowired ProductoRepository productos;

  @BeforeEach
  void reset() {
    pedidos.deleteAll();
    usuarios.deleteAll();
    productos
        .findAll()
        .forEach(
            p -> {
              p.stock = 50;
              productos.save(p);
            });
  }

  void registrar(String email) throws Exception {
    mvc.perform(
            post("/api/auth/registro")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    json.writeValueAsString(
                        Map.of("nombre", "Ana", "email", email, "password", "Password123!"))))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("passwordHash").doesNotExist());
  }

  MockHttpSession entrar(String email) throws Exception {
    return (MockHttpSession)
        mvc.perform(
                post("/api/auth/login")
                    .with(csrf())
                    .param("email", email)
                    .param("password", "Password123!"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("email").value(email))
            .andReturn()
            .getRequest()
            .getSession(false);
  }

  String solicitud(String clave, int cantidad) throws Exception {
    return json.writeValueAsString(
        Map.of(
            "clave",
            clave,
            "nombre",
            "Ana",
            "telefono",
            "999888777",
            "direccion",
            "Av. Lima 123, Los Olivos",
            "items",
            List.of(Map.of("productoId", 1, "cantidad", cantidad))));
  }

  @Test
  void registroNormalizaEmailYGuardaHash() throws Exception {
    registrar(" ANA@example.com ");
    assertThat(usuarios.findByEmail("ana@example.com")).isPresent();
    assertThat(usuarios.findByEmail("ana@example.com").get().passwordHash)
        .startsWith("$2")
        .doesNotContain("Password123!");
    mvc.perform(
            post("/api/auth/registro")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"nombre\":\"Ana\",\"email\":\"ana@example.com\",\"password\":\"Password123!\"}"))
        .andExpect(status().isConflict());
  }

  @Test
  void validaDatosYProtegePedidosAnonimos() throws Exception {
    mvc.perform(
            post("/api/auth/registro")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nombre\":\"\",\"email\":\"bad\",\"password\":\"123\"}"))
        .andExpect(status().isBadRequest());
    mvc.perform(get("/api/pedidos")).andExpect(status().isUnauthorized());
    mvc.perform(
            post("/api/pedidos")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(solicitud(UUID.randomUUID().toString(), 1)))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void sesionCsrfYLogoutFuncionan() throws Exception {
    registrar("ana@example.com");
    var s = entrar("ana@example.com");
    mvc.perform(get("/api/auth/yo").session(s)).andExpect(status().isOk());
    mvc.perform(
            post("/api/pedidos")
                .session(s)
                .contentType(MediaType.APPLICATION_JSON)
                .content(solicitud(UUID.randomUUID().toString(), 1)))
        .andExpect(status().isForbidden());
    mvc.perform(post("/api/auth/logout").session(s).with(csrf())).andExpect(status().isNoContent());
    mvc.perform(get("/api/auth/yo")).andExpect(status().isUnauthorized());
  }

  @Test
  void creaPedidoRecalculaTotalYEvitaDuplicados() throws Exception {
    registrar("ana@example.com");
    var s = entrar("ana@example.com");
    var clave = UUID.randomUUID().toString();
    for (int n = 0; n < 2; n++)
      mvc.perform(
              post("/api/pedidos")
                  .session(s)
                  .with(csrf())
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(solicitud(clave, 2)))
          .andExpect(status().isCreated())
          .andExpect(jsonPath("total").value(99.8))
          .andExpect(jsonPath("items[0].nombre").value("Sérum Hidratante"));
    assertThat(pedidos.count()).isEqualTo(1);
    assertThat(productos.findById(1L).get().stock).isEqualTo(48);
    mvc.perform(get("/api/pedidos").session(s))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1));
  }

  @Test
  void rechazaPrecioDelClienteCantidadesInvalidasYStockInsuficiente() throws Exception {
    registrar("ana@example.com");
    var s = entrar("ana@example.com");
    mvc.perform(
            post("/api/pedidos")
                .session(s)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(solicitud(UUID.randomUUID().toString(), 0)))
        .andExpect(status().isBadRequest());
    mvc.perform(
            post("/api/pedidos")
                .session(s)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(solicitud(UUID.randomUUID().toString(), 51)))
        .andExpect(status().isConflict());
    var body = json.readTree(solicitud(UUID.randomUUID().toString(), 1));
    ((com.fasterxml.jackson.databind.node.ObjectNode) body).put("total", 0.01);
    mvc.perform(
            post("/api/pedidos")
                .session(s)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body.toString()))
        .andExpect(status().isBadRequest());
    assertThat(pedidos.count()).isZero();
    assertThat(productos.findById(1L).get().stock).isEqualTo(50);
  }

  @Test
  void cadaUsuarioVeSoloSusPedidos() throws Exception {
    registrar("ana@example.com");
    var ana = entrar("ana@example.com");
    mvc.perform(
            post("/api/pedidos")
                .session(ana)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(solicitud(UUID.randomUUID().toString(), 1)))
        .andExpect(status().isCreated());
    registrar("bea@example.com");
    var bea = entrar("bea@example.com");
    mvc.perform(get("/api/pedidos").session(bea))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(0));
  }

  @Test
  void catalogoPublicoYProductoInexistente() throws Exception {
    mvc.perform(get("/api/productos"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(12));
    mvc.perform(get("/api/productos/99999")).andExpect(status().isNotFound());
  }

  @Test
  void suscripcionExigeConsentimientoYConsultaSeGuarda() throws Exception {
    mvc.perform(
            post("/api/suscripciones")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"ana@example.com\",\"consentimiento\":false}"))
        .andExpect(status().isBadRequest());
    mvc.perform(
            post("/api/suscripciones")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"ana@example.com\",\"consentimiento\":true}"))
        .andExpect(status().isOk());
    mvc.perform(
            post("/api/cotizaciones")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    json.writeValueAsString(
                        Map.of(
                            "nombre",
                            "Ana",
                            "email",
                            "ana@example.com",
                            "telefono",
                            "999888777",
                            "tipo",
                            "mayorista",
                            "producto",
                            "Sérum",
                            "cantidad",
                            10,
                            "ciudad",
                            "Lima",
                            "mensaje",
                            "Consulta",
                            "consentimiento",
                            true))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("id").isNumber());
  }
}
