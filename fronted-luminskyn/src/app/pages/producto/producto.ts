import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ApiService, Producto, mensajeError } from '../../services/api';
import { ProductCard } from '../../shared/product-card';
@Component({
  standalone: true,
  imports: [RouterLink, ProductCard],
  template: `<main id="contenido" class="page">
    <a routerLink="/tienda">← Volver al catálogo</a>
    @if (error()) {
      <p class="notice error" role="alert">{{ error() }}</p>
    } @else if (producto(); as p) {
      <div class="detail">
        <app-product-card [producto]="p" />
        <div>
          <p class="eyebrow">{{ p.categoria }}</p>
          <h1>{{ p.nombre }}</h1>
          <p>{{ p.descripcion }}</p>
          <p class="notice">Disponibles: {{ p.stock }} unidades</p>
          <p class="muted">
            Consulta los ingredientes y las instrucciones del fabricante antes de usar el producto.
          </p>
        </div>
      </div>
    } @else {
      <p role="status">Cargando producto…</p>
    }
  </main>`,
})
export class ProductoPage implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private sub?: Subscription;
  producto = signal<Producto | null>(null);
  error = signal('');
  ngOnInit() {
    this.sub = this.route.paramMap
      .pipe(switchMap((p) => this.api.producto(Number(p.get('id')))))
      .subscribe({
        next: (p) => this.producto.set(p),
        error: (e) => this.error.set(mensajeError(e)),
      });
  }
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
