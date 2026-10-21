package com.luminskyn.backend.service;

// Importa lista para manejar colecciones de pedidos
import java.util.List;

import org.springframework.stereotype.Service;

import com.luminskyn.backend.model.Pedido;
import com.luminskyn.backend.repository.PedidoRepository;

// Indica que esta clase es un servicio (Spring la gestiona automáticamente)
@Service
public class PedidoService {

    // Repositorio para interactuar con la base de datos
    private final PedidoRepository repo;

    // 🔹 Inyección por constructor (forma recomendada)
    // Spring automáticamente pasa el repositorio aquí
    public PedidoService(PedidoRepository repo) {
        this.repo = repo;
    }

    // 🟢 GUARDAR PEDIDO
    public Pedido guardar(Pedido pedido) {

        // Usa el repositorio para guardar en la base de datos
        // save() inserta o actualiza automáticamente
        return repo.save(pedido);
    }

    // 🔵 LISTAR TODOS LOS PEDIDOS
    public List<Pedido> listar() {

        // Obtiene todos los registros de la tabla Pedido
        return repo.findAll();
    }

    // 🔴 ELIMINAR PEDIDO POR ID
    public void eliminar(Long id) {

        // Elimina el pedido según su ID
        repo.deleteById(id);
    }

    // 🟡 OBTENER PEDIDO POR ID
    public Pedido obtenerPorId(Long id) {

        // Busca el pedido por ID
        // Si no existe → devuelve null
        return repo.findById(id).orElse(null);
    }
}