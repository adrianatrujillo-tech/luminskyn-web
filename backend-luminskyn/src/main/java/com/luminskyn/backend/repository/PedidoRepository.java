package com.luminskyn.backend.repository;

// Importa JpaRepository de Spring Data JPA
// Esto te permite trabajar con la base de datos sin escribir SQL
import org.springframework.data.jpa.repository.JpaRepository;

import com.luminskyn.backend.model.Pedido;

// Define una interfaz (no clase)
// Spring crea automáticamente la implementación
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // 👉 No necesitas escribir nada aquí para lo básico

    // JpaRepository ya te da métodos como:

    // save(pedido)        → guardar en la BD
    // findById(id)        → buscar por ID
    // findAll()           → listar todos
    // deleteById(id)      → eliminar por ID

}