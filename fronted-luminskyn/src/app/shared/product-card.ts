import { Component, input, signal, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../services/api';
import { CarritoService } from '../services/carrito';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  template: ` <article class="card">
    @if (producto().oferta) {
      <span class="badge">Oferta</span>
    } @else if (producto().nuevo) {
      <span class="badge">Nuevo</span>
    }
    <a [routerLink]="['/producto', producto().id]"
      ><img [src]="producto().imagen" [alt]="producto().nombre" loading="lazy" />
      <h3>{{ producto().nombre }}</h3></a
    >
    <p class="muted">{{ producto().categoria }}</p>
    <p class="price">{{ producto().precio | currency: 'PEN' : 'S/ ' : '1.2-2' }}</p>
    <div class="stepper">
      <button
        type="button"
        (click)="cantidad.set(cantidad() - 1)"
        [disabled]="cantidad() <= 1"
        [attr.aria-label]="'Reducir cantidad de ' + producto().nombre"
      >
        −</button
      ><span>{{ cantidad() }}</span
      ><button
        type="button"
        (click)="cantidad.set(cantidad() + 1)"
        [disabled]="cantidad() >= producto().stock || cantidad() >= 99"
        [attr.aria-label]="'Aumentar cantidad de ' + producto().nombre"
      >
        +
      </button>
    </div>
    <button class="button" type="button" [disabled]="producto().stock < 1" (click)="agregar()">
      {{ producto().stock < 1 ? 'Agotado' : 'Agregar al carrito' }}
    </button>
    <p class="feedback" role="status">{{ mensaje() }}</p>
  </article>`,
  styles: [
    `
      :host {
        display: block;
      }
      .card {
        position: relative;
        background: white;
        border: 1px solid #e6dfef;
        border-radius: 16px;
        padding: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .card img {
        width: 100%;
        height: 190px;
        object-fit: contain;
        margin-bottom: 16px;
      }
      .card h3 {
        font-size: 17px;
        color: #342849;
      }
      .price {
        font-weight: 700;
        color: #6549a0;
      }
      .badge {
        position: absolute;
        top: 12px;
        left: 12px;
        border-radius: 20px;
        background: #eee7fa;
        padding: 4px 12px;
        font-size: 12px;
      }
      .feedback {
        font-size: 12px;
        min-height: 36px;
      }
      .stepper {
        display: flex;
        align-items: center;
        gap: 18px;
        margin-top: auto;
      }
      .stepper button {
        border: 1px solid #ded5ea;
        border-radius: 6px;
        width: 32px;
        height: 32px;
        background: white;
        cursor: pointer;
      }
      .button {
        width: 100%;
      }
    `,
  ],
})
export class ProductCard {
  readonly producto = input.required<Producto>();
  readonly cantidad = signal(1);
  readonly mensaje = signal('');
  private carrito = inject(CarritoService);
  agregar() {
    try {
      this.carrito.agregar(this.producto(), this.cantidad());
      this.mensaje.set('Añadido al carrito.');
    } catch (e) {
      this.mensaje.set((e as Error).message);
    }
  }
}
