package com.luminskyn.backend.config;

import com.luminskyn.backend.model.Producto;
import com.luminskyn.backend.repository.ProductoRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;

@Configuration
public class CatalogoInicial {
  @Bean
  CommandLineRunner catalogo(ProductoRepository repo) {
    return args -> {
      var productos =
          List.of(
              new Producto(
                  1,
                  "Sérum Hidratante",
                  "49.90",
                  "Hidratación",
                  "Sérum facial para complementar tu hidratación diaria.",
                  false),
              new Producto(
                  2,
                  "Crema Facial",
                  "39.90",
                  "Hidratación",
                  "Crema para el cuidado diario del rostro.",
                  false),
              new Producto(
                  3,
                  "Protector Solar",
                  "59.90",
                  "Protección",
                  "Protector para incorporar a tu rutina de día. Revisa las indicaciones del"
                      + " envase.",
                  false),
              new Producto(
                  4,
                  "Gel Limpiador",
                  "29.90",
                  "Limpieza",
                  "Gel para la limpieza del rostro.",
                  false),
              new Producto(
                  5,
                  "Tónico Facial",
                  "34.90",
                  "Limpieza",
                  "Tónico para complementar la limpieza facial.",
                  false),
              new Producto(
                  6,
                  "Mascarilla Facial",
                  "24.90",
                  "Tratamiento",
                  "Mascarilla para tu momento de cuidado personal.",
                  true),
              new Producto(
                  7,
                  "Set de Cuidado Facial",
                  "69.90",
                  "Tratamiento",
                  "Set de productos cosméticos para el cuidado facial.",
                  false),
              new Producto(
                  8,
                  "Loción Facial",
                  "27.90",
                  "Limpieza",
                  "Loción cosmética para complementar el cuidado facial.",
                  false),
              new Producto(
                  9,
                  "Rodillo Facial",
                  "32.90",
                  "Tratamiento",
                  "Rodillo para acompañar tu rutina de cuidado personal.",
                  false),
              new Producto(
                  10,
                  "Esponja y Brocha Facial",
                  "44.90",
                  "Hidratación",
                  "Accesorios para la aplicación de productos cosméticos.",
                  false),
              new Producto(
                  11,
                  "Kit de Cuidado Facial",
                  "56.00",
                  "Tratamiento",
                  "Kit de productos cosméticos para el cuidado del rostro.",
                  true),
              new Producto(
                  12,
                  "Gel Crema Hidratante",
                  "19.90",
                  "Accesorios",
                  "Gel crema para complementar la hidratación facial.",
                  false));
      var imagenes =
          java.util.Map.ofEntries(
              java.util.Map.entry(1L, 1),
              java.util.Map.entry(2L, 3),
              java.util.Map.entry(3L, 11),
              java.util.Map.entry(4L, 2),
              java.util.Map.entry(5L, 4),
              java.util.Map.entry(6L, 12),
              java.util.Map.entry(7L, 6),
              java.util.Map.entry(8L, 7),
              java.util.Map.entry(9L, 9),
              java.util.Map.entry(10L, 10),
              java.util.Map.entry(11L, 5),
              java.util.Map.entry(12L, 8));
      for (var p : productos) {
        p.imagen = "assets/img/producto" + imagenes.get(p.id) + ".jpg";
        if (p.id == 9 || p.id == 10) p.categoria = "Accesorios";
        if (p.id == 12) p.categoria = "Hidratación";
      }
      for (var p : productos) if (!repo.existsById(p.id)) repo.save(p);
    };
  }
}
