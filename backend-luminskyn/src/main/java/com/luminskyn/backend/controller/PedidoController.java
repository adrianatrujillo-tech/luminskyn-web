package com.luminskyn.backend.controller;

// Permite habilitar CORS (conexión entre frontend y backend)
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luminskyn.backend.model.Pedido;
import com.luminskyn.backend.service.PedidoService;

// Indica que esta clase es un controlador REST
@RestController

// Ruta base → http://localhost:8080/api/pedidos
@RequestMapping("/api/pedidos")

// Permite que Angular (puerto 4200) pueda hacer peticiones
@CrossOrigin(origins = "http://localhost:4200")
public class PedidoController {

    // Servicio que maneja la lógica (guardar en BD)
    private final PedidoService service;

    // Constructor → inyección de dependencias
    public PedidoController(PedidoService service) {
        this.service = service;
    }

    // Maneja peticiones POST → crear pedido
    @PostMapping
    public Pedido guardar(@RequestBody Pedido pedido) {

        // 🔥 Mensajes de prueba en consola
        System.out.println("🔥 LLEGÓ PEDIDO:");

        // Muestra los items del carrito (JSON enviado desde Angular)
        System.out.println(pedido.getItems());

        // Muestra el total de la compra
        System.out.println(pedido.getTotal());

        // Llama al servicio para guardar el pedido en la base de datos
        return service.guardar(pedido);
    }
}