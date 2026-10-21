// Importa decoradores y herramientas de Angular
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

// Función para verificar si estamos en navegador (y no en servidor SSR)
import { isPlatformBrowser } from '@angular/common';

// Hace que este servicio esté disponible en toda la aplicación (singleton)
@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  // 🛒 Array donde se almacenan los productos del carrito
  carrito: any[] = [];

  // Constructor: se ejecuta al iniciar el servicio
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Carga el carrito guardado en localStorage (si existe)
    this.cargarCarrito();
  }

  // 🛒 AGREGAR PRODUCTO AL CARRITO
  agregar(producto: any) {

    // Busca si el producto ya existe en el carrito (por nombre)
    const existente = this.carrito.find(p => p.nombre === producto.nombre);

    // Si ya existe → suma la cantidad
    if (existente) {
      existente.cantidad += producto.cantidad;

    // Si no existe → lo agrega al carrito
    } else {
      this.carrito.push({ ...producto }); // copia del objeto
    }

    // Guarda los cambios en localStorage
    this.guardarCarrito();
  }

  // 📦 OBTENER TODOS LOS PRODUCTOS DEL CARRITO
  obtener() {
    return this.carrito;
  }

  // 🧹 VACIAR EL CARRITO COMPLETAMENTE
  vaciar() {
    this.carrito.length = 0; // elimina todos los elementos
    this.guardarCarrito();   // guarda cambios
  }

  // 💰 CALCULAR TOTAL A PAGAR
  total() {
    // Recorre todos los productos y suma precio * cantidad
    return this.carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  }

  // 🛒 CALCULAR CANTIDAD TOTAL DE PRODUCTOS
  cantidadTotal() {
    // Suma todas las cantidades de productos
    return this.carrito.reduce((total, p) => total + p.cantidad, 0);
  }

  // 💾 GUARDAR CARRITO EN LOCALSTORAGE
  guardarCarrito() {

    // Solo se ejecuta si estamos en navegador
    if (isPlatformBrowser(this.platformId)) {

      // Guarda el carrito como string JSON
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
  }

  // 🔄 CARGAR CARRITO DESDE LOCALSTORAGE
  cargarCarrito() {

    // Solo se ejecuta en navegador
    if (isPlatformBrowser(this.platformId)) {

      // Obtiene los datos guardados
      const data = localStorage.getItem('carrito');

      // Si existen datos → los convierte a objeto
      if (data) {
        this.carrito = JSON.parse(data);
      }
    }
  }

  // ❌ ELIMINAR UN PRODUCTO POR NOMBRE
  eliminar(nombre: string) {

    // Filtra el carrito quitando ese producto
    this.carrito = this.carrito.filter(p => p.nombre !== nombre);

    // Guarda cambios
    this.guardarCarrito();
  }

  // ➕ AUMENTAR CANTIDAD DE UN PRODUCTO
  aumentar(nombre: string) {

    // Busca el producto
    const producto = this.carrito.find(p => p.nombre === nombre);

    // Si existe → aumenta cantidad
    if (producto) {
      producto.cantidad++;

      // Guarda cambios
      this.guardarCarrito();
    }
  }

  // ➖ DISMINUIR CANTIDAD DE UN PRODUCTO
  disminuir(nombre: string) {

    // Busca el producto
    const producto = this.carrito.find(p => p.nombre === nombre);

    // Si existe y la cantidad es mayor a 1 → reduce
    if (producto && producto.cantidad > 1) {
      producto.cantidad--;

      // Guarda cambios
      this.guardarCarrito();
    }
  }

}