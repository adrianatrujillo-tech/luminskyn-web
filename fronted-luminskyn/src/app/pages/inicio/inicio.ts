// Importa decorador de Angular para crear componentes
import { Component } from '@angular/core';

// Permite usar *ngIf, *ngFor, etc.
import { CommonModule } from '@angular/common';

// Permite usar formularios (ngModel, etc.)
import { FormsModule } from '@angular/forms';

// Servicio del carrito (lógica central)
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-inicio', // Nombre del componente en HTML
  standalone: true,       // Componente independiente
  imports: [CommonModule, FormsModule], // Módulos que puede usar
  templateUrl: './inicio.html', // HTML
  styleUrl: './inicio.css',     // CSS
})
export class Inicio {

  // Inyección del servicio carrito
  constructor(private carritoService: CarritoService) {}

  // 🟣 PRODUCTOS NUEVOS

  // ❗ ESTA VARIABLE ES GLOBAL (problema)
  cantidad = 1;

  // Aumenta la cantidad
  aumentar() {
    this.cantidad++;
  }

  // Disminuye la cantidad (mínimo 1)
  disminuir() {
    if (this.cantidad > 1) this.cantidad--;
  }

  // Agrega producto al carrito
  agregarCarrito() {

    // Crea el objeto producto
    const producto = {
      nombre: 'Sérum Hidratante',
      precio: 49.9,
      cantidad: this.cantidad
    };

    // Lo envía al servicio
    this.carritoService.agregar(producto);

    // Muestra en consola
    console.log("Producto agregado:", producto);
  }

  // 🟡 OFERTAS

  // ❗ OTRA VARIABLE GLOBAL
  cantidadOferta = 1;

  // Aumenta cantidad de oferta
  aumentarOferta() {
    this.cantidadOferta++;
  }

  // Disminuye cantidad de oferta
  disminuirOferta() {
    if (this.cantidadOferta > 1) this.cantidadOferta--;
  }

  // Agrega producto de oferta
  agregarCarritoOferta() {
    const producto = {
      nombre: 'Sérum Vitamina C',
      precio: 56.0,
      cantidad: this.cantidadOferta
    };

    this.carritoService.agregar(producto);

    console.log("Oferta agregada:", producto);
  }

  // 🔵 MODAL

  // Controla si el modal está visible
  mostrarModal = false;

  // Abre el modal
  abrirFormulario() {
    this.mostrarModal = true;
  }

  // Cierra el modal
  cerrarModal() {
    this.mostrarModal = false;
  }

  // Envía el formulario
  enviarFormulario() {
    console.log("Formulario enviado");
    this.cerrarModal();
  }

}