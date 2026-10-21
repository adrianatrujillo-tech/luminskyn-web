import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, mensajeError } from '../../services/api';
@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: ` <main id="contenido" class="page">
    <section class="panel auth-panel">
      <p class="eyebrow">HABLEMOS DE TU PEDIDO</p>
      <h1>Solicita una cotización</h1>
      <p class="muted">
        Tu solicitud quedará registrada para su revisión. Este formulario no envía correos
        automáticos.
      </p>
      <form #form="ngForm" (ngSubmit)="enviar(form)" class="form-stack">
        <label
          >Nombre completo<input
            name="nombre"
            [(ngModel)]="datos.nombre"
            required
            maxlength="80" /></label
        ><label
          >Correo electrónico<input
            name="email"
            [(ngModel)]="datos.email"
            type="email"
            required
            email
            maxlength="160" /></label
        ><label
          >Teléfono<input
            name="telefono"
            [(ngModel)]="datos.telefono"
            type="tel"
            required
            pattern="[+0-9 ()-]{6,25}" /></label
        ><label
          >Tipo de cliente<select name="tipo" [(ngModel)]="datos.tipo" required>
            <option value="individual">Individual</option>
            <option value="mayorista">Mayorista</option>
            <option value="empresa">Empresa</option>
          </select></label
        ><label
          >Producto de interés<input
            name="producto"
            [(ngModel)]="datos.producto"
            required
            maxlength="160" /></label
        ><label
          >Cantidad aproximada<input
            name="cantidad"
            [(ngModel)]="datos.cantidad"
            type="number"
            min="1"
            max="10000"
            step="1"
            required /></label
        ><label
          >Ciudad<input name="ciudad" [(ngModel)]="datos.ciudad" required maxlength="100" /></label
        ><label
          >Mensaje adicional<textarea
            name="mensaje"
            [(ngModel)]="datos.mensaje"
            maxlength="2000"
          ></textarea></label
        ><label class="check"
          ><input
            type="checkbox"
            name="consentimiento"
            [(ngModel)]="datos.consentimiento"
            required
          />
          Acepto guardar mis datos para gestionar esta solicitud.
          <a routerLink="/ayuda/privacidad">Privacidad</a></label
        >
        @if (error()) {
          <p class="notice error" role="alert">{{ error() }}</p>
        }
        @if (exito()) {
          <p class="notice success" role="status">{{ exito() }}</p>
        }
        <button class="button" [disabled]="ocupado()" type="submit">
          {{ ocupado() ? 'Guardando…' : 'Registrar solicitud' }}
        </button>
      </form>
    </section>
  </main>`,
})
export class Contacto {
  private api = inject(ApiService);
  datos = {
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'individual',
    producto: '',
    cantidad: 1,
    ciudad: '',
    mensaje: '',
    consentimiento: false,
  };
  error = signal('');
  exito = signal('');
  ocupado = signal(false);
  enviar(f: NgForm) {
    if (this.ocupado()) return;
    if (f.invalid || !Number.isInteger(this.datos.cantidad)) {
      this.error.set('Completa los campos e indica una cantidad entera válida.');
      return;
    }
    this.error.set('');
    this.exito.set('');
    this.ocupado.set(true);
    this.api.post<{ id: number; message: string }>('/api/cotizaciones', this.datos).subscribe({
      next: (r) => {
        this.exito.set('Solicitud #' + r.id + ' registrada. Conserva este número de referencia.');
        this.ocupado.set(false);
        f.resetForm({ tipo: 'individual', cantidad: 1, consentimiento: false });
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.ocupado.set(false);
      },
    });
  }
}
