import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService, Producto, mensajeError } from '../../services/api';
import { ProductCard } from '../../shared/product-card';
@Component({
  standalone: true,
  imports: [FormsModule, ProductCard],
  template: ` <main id="contenido" class="page">
    <div class="page-heading">
      <p class="eyebrow">LUMINSKYN / CATÁLOGO</p>
      <h1>Encuentra tu próximo favorito</h1>
      <p class="muted">Productos para acompañar tu rutina diaria.</p>
    </div>
    <div class="filters">
      <label
        >Buscar<input
          type="search"
          placeholder="Nombre de producto"
          [ngModel]="busqueda()"
          (ngModelChange)="busqueda.set($event)" /></label
      ><label
        >Categoría<select [ngModel]="categoria()" (ngModelChange)="categoria.set($event)">
          <option value="">Todas</option>
          @for (c of categorias; track c) {
            <option [value]="c">{{ c }}</option>
          }
        </select></label
      ><label
        >Ordenar<select [ngModel]="orden()" (ngModelChange)="orden.set($event)">
          <option value="nombre">Nombre</option>
          <option value="menor">Menor precio</option>
          <option value="mayor">Mayor precio</option>
        </select></label
      ><label class="check"
        ><input
          type="checkbox"
          [ngModel]="soloOfertas()"
          (ngModelChange)="soloOfertas.set($event)"
        />
        Solo ofertas</label
      >
    </div>
    @if (cargando()) {
      <p role="status">Cargando catálogo…</p>
    } @else if (error()) {
      <div class="notice error" role="alert">
        {{ error() }} <button class="button" (click)="cargar()">Reintentar</button>
      </div>
    } @else {
      <p class="muted">{{ filtrados().length }} productos</p>
      <div class="product-grid">
        @for (p of filtrados(); track p.id) {
          <app-product-card [producto]="p" />
        } @empty {
          <p>
            No encontramos productos.
            <button class="text-button" (click)="limpiar()">Limpiar filtros</button>
          </p>
        }
      </div>
    }
  </main>`,
})
export class Tienda implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private params?: Subscription;
  productos = signal<Producto[]>([]);
  error = signal('');
  cargando = signal(true);
  busqueda = signal('');
  categoria = signal('');
  orden = signal('nombre');
  soloOfertas = signal(false);
  categorias = ['Limpieza', 'Hidratación', 'Protección', 'Tratamiento', 'Accesorios'];
  ngOnInit() {
    this.params = this.route.queryParamMap.subscribe((p) => {
      this.categoria.set(p.get('categoria') || '');
      this.soloOfertas.set(p.get('ofertas') === 'si');
    });
    this.cargar();
  }
  ngOnDestroy() {
    this.params?.unsubscribe();
  }
  cargar() {
    this.error.set('');
    this.cargando.set(true);
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
  filtrados() {
    return this.productos()
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(this.busqueda().trim().toLowerCase()) &&
          (!this.categoria() || p.categoria === this.categoria()) &&
          (!this.soloOfertas() || p.oferta),
      )
      .sort((a, b) =>
        this.orden() === 'menor'
          ? a.precio - b.precio
          : this.orden() === 'mayor'
            ? b.precio - a.precio
            : a.nombre.localeCompare(b.nombre),
      );
  }
  limpiar() {
    this.busqueda.set('');
    this.categoria.set('');
    this.soloOfertas.set(false);
  }
}
