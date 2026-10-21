import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Pedido, mensajeError } from '../../services/api';
import { AuthService } from '../../services/auth';
@Component({
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  template: ` <main id="contenido" class="page">
    <div class="page-heading">
      <p class="eyebrow">MI CUENTA</p>
      <h1>Hola, {{ auth.usuario()?.nombre }}</h1>
      <p>{{ auth.usuario()?.email }}</p>
      <button class="text-button" (click)="salir()">Cerrar sesión</button>
    </div>
    <h2>Mis pedidos</h2>
    @if (cargando()) {
      <p role="status">Cargando pedidos…</p>
    }
    @if (error()) {
      <p class="notice error" role="alert">{{ error() }}</p>
      <button class="button" (click)="cargar()">Reintentar</button>
    }
    @for (p of pedidos(); track p.id) {
      <article class="panel order">
        <div class="row">
          <h3>Pedido #{{ p.id }}</h3>
          <span class="badge-static">{{ p.estado }}</span>
        </div>
        <p>{{ p.fecha | date: 'dd/MM/yyyy HH:mm' }} · Pago contra entrega</p>
        <ul>
          @for (i of p.items; track i.productoId) {
            <li>
              {{ i.nombre }} × {{ i.cantidad }} —
              {{ i.precio * i.cantidad | currency: 'PEN' : 'S/ ' : '1.2-2' }}
            </li>
          }
        </ul>
        <p>
          <strong>Total: {{ p.total | currency: 'PEN' : 'S/ ' : '1.2-2' }}</strong>
        </p>
        <p>Entrega: {{ p.direccion }}</p>
        <p class="muted">Pedido registrado; no se ha realizado ningún cobro en línea.</p>
      </article>
    }
    @if (!cargando() && !error() && !pedidos().length) {
      <div class="panel">
        <p>Todavía no tienes pedidos.</p>
        <a routerLink="/tienda" class="button">Explorar productos</a>
      </div>
    }
  </main>`,
})
export class Cuenta implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  pedidos = signal<Pedido[]>([]);
  error = signal('');
  cargando = signal(true);
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.api.pedidos().subscribe({
      next: (p) => {
        this.pedidos.set(p);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        this.error.set(mensajeError(e));
        if (e.status === 401) {
          this.auth.usuario.set(null);
          this.router.navigate(['/login']);
        }
      },
    });
  }
  salir() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}
