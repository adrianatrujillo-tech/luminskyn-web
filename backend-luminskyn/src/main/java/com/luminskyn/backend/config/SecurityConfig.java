package com.luminskyn.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.luminskyn.backend.repository.UsuarioRepository;
import com.luminskyn.backend.service.CuentaService;
import java.util.Locale;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.*;

@Configuration
public class SecurityConfig {
  @Bean
  PasswordEncoder passwords() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  UserDetailsService users(UsuarioRepository repo) {
    return email -> {
      var u =
          repo.findByEmail(email.trim().toLowerCase(Locale.ROOT))
              .orElseThrow(() -> new UsernameNotFoundException("Credenciales inválidas"));
      return User.withUsername(u.email).password(u.passwordHash).roles("CLIENTE").build();
    };
  }

  @Bean
  SecurityFilterChain security(HttpSecurity http, ObjectMapper json, CuentaService cuentas)
      throws Exception {
    var csrfRepo = CookieCsrfTokenRepository.withHttpOnlyFalse();
    csrfRepo.setCookiePath("/");
    http.addFilterBefore(
            new AuthRateLimitFilter(),
            org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
                .class)
        .csrf(
            csrf ->
                csrf.csrfTokenRepository(csrfRepo)
                    .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers(
                        HttpMethod.GET, "/api/productos", "/api/productos/*", "/api/auth/csrf")
                    .permitAll()
                    .requestMatchers(
                        HttpMethod.POST,
                        "/api/auth/registro",
                        "/api/auth/login",
                        "/api/suscripciones",
                        "/api/cotizaciones")
                    .permitAll()
                    .requestMatchers("/error")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .requestCache(c -> c.disable())
        .formLogin(
            form ->
                form.loginProcessingUrl("/api/auth/login")
                    .usernameParameter("email")
                    .successHandler(
                        (req, res, a) -> {
                          res.setContentType("application/json;charset=UTF-8");
                          json.writeValue(res.getWriter(), cuentas.perfil(a.getName()));
                        })
                    .failureHandler(
                        (req, res, e) -> {
                          res.setStatus(401);
                          res.setContentType("application/json;charset=UTF-8");
                          json.writeValue(
                              res.getWriter(),
                              java.util.Map.of("message", "Correo o contraseña incorrectos."));
                        }))
        .logout(
            logout ->
                logout
                    .logoutUrl("/api/auth/logout")
                    .logoutSuccessHandler((req, res, a) -> res.setStatus(204)))
        .exceptionHandling(
            e ->
                e.authenticationEntryPoint(
                        (req, res, x) -> {
                          res.setStatus(401);
                          res.setContentType("application/json;charset=UTF-8");
                          json.writeValue(
                              res.getWriter(),
                              java.util.Map.of("message", "Inicia sesión para continuar."));
                        })
                    .accessDeniedHandler(
                        (req, res, x) -> {
                          res.setStatus(403);
                          res.setContentType("application/json;charset=UTF-8");
                          json.writeValue(
                              res.getWriter(),
                              java.util.Map.of(
                                  "message", "Actualiza la página y vuelve a intentarlo."));
                        }));
    return http.build();
  }
}
