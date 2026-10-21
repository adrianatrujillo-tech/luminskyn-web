import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Producto, mensajeError } from '../../services/api';
import { ProductCard } from '../../shared/product-card';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, ProductCard],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private api = inject(ApiService);
  productos = signal<Producto[]>([]);
  error = signal('');
  cargando = signal(true);
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.api.productos().subscribe({
      next: (p) => {
        this.productos.set(p);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }
  nuevos() {
    return this.productos().filter((p) => p.nuevo);
  }
  ofertas() {
    return this.productos().filter((p) => p.oferta);
  }
}
