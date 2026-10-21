// Importa decorador para crear componentes
import { Component } from '@angular/core';

// Permite usar directivas básicas como *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Servicio que maneja el carrito (lógica central)
import { CarritoService } from '../../services/carrito';

// Servicio para enviar datos al backend (API)
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-carrito', // Nombre del componente en HTML
  standalone: true,        // Componente independiente (Angular moderno)
  imports: [CommonModule], // Módulos que puede usar el HTML
  templateUrl: './carrito.html', // Vista HTML
  styleUrl: './carrito.css',     // Estilos
})
export class Carrito {

  // Inyección de dependencias (servicios)
  constructor(
    private carritoService: CarritoService,
    private apiService: ApiService
  ) {}

  // 🛒 OBTENER CARRITO (REACTIVO)
  // Cada vez que Angular lo usa, obtiene el estado actualizado
  get carrito() {
    return this.carritoService.obtener();
  }

  // 💰 TOTAL DEL CARRITO
  get total() {
    return this.carritoService.total();
  }

  // 🔥 RESUMEN DE COMPRA (para mostrar en modal)
  resumenCompra: any[] = [];

  // 🔥 CONTROL DEL MODAL (mostrar u ocultar)
  mostrarModal = false;

  // 🛒 CANTIDAD TOTAL DE PRODUCTOS (para header o badge)
  cantidadTotal() {
    return this.carrito.reduce((total, p) => total + p.cantidad, 0);
  }

  // ❌ ELIMINAR PRODUCTO
  eliminarProducto(nombre: string) {
    // Confirmación antes de eliminar
    if (confirm("¿Eliminar producto?")) {
      this.carritoService.eliminar(nombre);
    }
  }

  // ➕ AUMENTAR CANTIDAD DE UN PRODUCTO
  aumentarCantidad(nombre: string) {
    this.carritoService.aumentar(nombre);
  }

  // ➖ DISMINUIR CANTIDAD DE UN PRODUCTO
  disminuirCantidad(nombre: string) {
    this.carritoService.disminuir(nombre);
  }

  // 🧹 VACIAR TODO EL CARRITO
  vaciarCarrito() {
    this.carritoService.vaciar();
  }

  // 🛍️ REALIZAR COMPRA
  comprarCarrito() {

    // Si el carrito está vacío → no hace nada
    if (this.carrito.length === 0) return;

    // Construye el objeto pedido para enviar al backend
    const pedido = {
      items: JSON.stringify(this.carrito), // convierte a texto JSON
      total: this.total                    // total de la compra
    };

    // Llama al API para enviar el pedido
    this.apiService.enviarPedido(pedido).subscribe({

      // ✅ SI TODO SALE BIEN
      next: (res) => {
        console.log("Pedido enviado:", res);

        // 🔥 1. Guarda una copia del carrito (para mostrar resumen)
        this.resumenCompra = [...this.carrito];

        // 🔥 2. Abre el modal de confirmación
        this.mostrarModal = true;

        // 🔥 3. Vacía el carrito después de comprar
        this.carritoService.vaciar();
      },

      // ❌ SI HAY ERROR
      error: (err) => {
        console.error("Error:", err);

        // (esto no hace nada realmente, puedes quitarlo)
        setTimeout(() => {}, 0);
      }
    });
  }

  // ❌ CERRAR MODAL
  cerrarModal() {
    this.mostrarModal = false; 
  }

}