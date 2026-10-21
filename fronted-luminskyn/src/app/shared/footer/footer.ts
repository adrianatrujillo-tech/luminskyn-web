import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, mensajeError } from '../../services/api';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class FooterComponent {
  private api = inject(ApiService);
  correo = '';
  consentimiento = false;
  mensaje = signal('');
  ocupado = signal(false);
  suscribirse(f: NgForm) {
    if (this.ocupado()) return;
    if (f.invalid) {
      this.mensaje.set('Introduce un correo válido y acepta guardar tu suscripción.');
      return;
    }
    this.ocupado.set(true);
    this.mensaje.set('');
    this.api
      .post<{ message: string }>('/api/suscripciones', {
        email: this.correo,
        consentimiento: this.consentimiento,
      })
      .subscribe({
        next: (r) => {
          this.mensaje.set(r.message);
          this.ocupado.set(false);
          f.resetForm();
        },
        error: (e) => {
          this.mensaje.set(mensajeError(e));
          this.ocupado.set(false);
        },
      });
  }
}
