import { Component, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Pedido, mensajeError } from '../../services/api';
import { AuthService } from '../../services/auth';
import { CarritoService } from '../../services/carrito';
@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit {
  cart = inject(CarritoService);
  auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  error = signal('');
  aviso = signal('');
  ocupado = signal(false);
  listo = signal(false);
  confirmacion = signal<Pedido | null>(null);
  nombre = this.auth.usuario()?.nombre || '';
  telefono = '';
  direccion = '';
  ngOnInit() {
    this.actualizar();
  }
  actualizar() {
    this.listo.set(false);
    this.api.productos().subscribe({
      next: (ps) => {
        if (this.cart.reconciliar(ps))
          this.aviso.set(
            'Actualizamos los precios o cantidades disponibles de tu carrito. Revisa el total.',
          );
        this.listo.set(true);
      },
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
  comprar(form: NgForm) {
    if (this.ocupado() || !this.cart.items().length || !this.listo()) return;
    if (!this.auth.usuario()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/carrito' } });
      return;
    }
    if (form.invalid || !this.nombre.trim() || this.direccion.trim().length < 8) {
      this.error.set('Completa tu nombre, teléfono y dirección de entrega.');
      return;
    }
    const datos = {
      nombre: this.nombre.trim(),
      telefono: this.telefono.trim(),
      direccion: this.direccion.trim(),
      items: this.cart.items().map((p) => ({ productoId: p.id, cantidad: p.cantidad })),
    };
    const huella = JSON.stringify({ usuario: this.auth.usuario()?.id, ...datos });
    let clave = crypto.randomUUID();
    try {
      const anterior = JSON.parse(sessionStorage.getItem('luminskyn-pedido-pendiente') || 'null');
      if (anterior?.huella === huella) clave = anterior.clave;
      sessionStorage.setItem('luminskyn-pedido-pendiente', JSON.stringify({ huella, clave }));
    } catch {}
    this.ocupado.set(true);
    this.error.set('');
    this.api.enviarPedido({ ...datos, clave }).subscribe({
      next: (p) => {
        this.confirmacion.set(p);
        this.cart.vaciar();
        this.ocupado.set(false);
        try {
          sessionStorage.removeItem('luminskyn-pedido-pendiente');
        } catch {}
      },
      error: (e) => {
        this.ocupado.set(false);
        this.error.set(mensajeError(e));
        if (e.status === 401) {
          this.auth.usuario.set(null);
          this.router.navigate(['/login'], { queryParams: { returnUrl: '/carrito' } });
        } else if (e.status === 409) this.actualizar();
      },
    });
  }
}
