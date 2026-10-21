import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { mensajeError } from '../../services/api';
import { switchMap } from 'rxjs';
@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: ` <main id="contenido" class="page">
    <section class="panel auth-panel">
      <p class="eyebrow">TU ESPACIO LUMINSKYN</p>
      <h1>{{ registro ? 'Crea tu cuenta' : 'Bienvenida de nuevo' }}</h1>
      <p class="muted">
        {{
          registro
            ? 'Guarda tus pedidos y consulta su estado.'
            : 'Inicia sesión para completar tu pedido.'
        }}
      </p>
      <form #form="ngForm" (ngSubmit)="enviar(form)" class="form-stack">
        @if (registro) {
          <label
            >Nombre completo<input
              name="nombre"
              [(ngModel)]="nombre"
              required
              maxlength="80"
              autocomplete="name"
          /></label>
        }
        <label
          >Correo electrónico<input
            name="email"
            type="email"
            [(ngModel)]="email"
            required
            email
            maxlength="160"
            autocomplete="email"
        /></label>
        <label
          >Contraseña<input
            name="password"
            type="password"
            [(ngModel)]="password"
            required
            [minlength]="registro ? 8 : 1"
            maxlength="72"
            [autocomplete]="registro ? 'new-password' : 'current-password'"
        /></label>
        @if (registro) {
          <p class="muted">Usa al menos 8 caracteres (máximo 72 bytes).</p>
          <label
            >Repite la contraseña<input
              name="repetir"
              type="password"
              [(ngModel)]="repetir"
              required
              autocomplete="new-password" /></label
          ><label class="check"
            ><input type="checkbox" name="acepta" [(ngModel)]="acepta" required /> He leído la
            <a routerLink="/ayuda/privacidad">información de privacidad</a>.</label
          >
        }
        @if (error()) {
          <p class="error notice" role="alert">{{ error() }}</p>
        }
        <button class="button" type="submit" [disabled]="ocupado()">
          {{ ocupado() ? 'Procesando…' : registro ? 'Crear cuenta' : 'Iniciar sesión' }}
        </button>
      </form>
      <p class="auth-switch">
        {{ registro ? '¿Ya tienes una cuenta?' : '¿Aún no tienes cuenta?' }}
        <a
          [routerLink]="registro ? '/login' : '/registro'"
          [queryParams]="{ returnUrl: destino }"
          >{{ registro ? 'Inicia sesión' : 'Regístrate' }}</a
        >
      </p>
    </section>
  </main>`,
})
export class AuthPage {
  auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  registro = this.route.snapshot.data['registro'] === true;
  nombre = '';
  email = '';
  password = '';
  repetir = '';
  acepta = false;
  error = signal('');
  ocupado = signal(false);
  get destino() {
    const u = this.route.snapshot.queryParamMap.get('returnUrl');
    return u && u.startsWith('/') && !u.startsWith('//') ? u : '/cuenta';
  }
  enviar(form: NgForm) {
    if (this.ocupado()) return;
    if (
      form.invalid ||
      !this.email.trim() ||
      (this.registro && (!this.nombre.trim() || this.password !== this.repetir))
    ) {
      this.error.set(
        'Completa los campos correctamente y comprueba que las contraseñas coincidan.',
      );
      return;
    }
    this.ocupado.set(true);
    this.error.set('');
    const accion = this.registro
      ? this.auth
          .registro(this.nombre, this.email, this.password)
          .pipe(switchMap(() => this.auth.login(this.email, this.password)))
      : this.auth.login(this.email, this.password);
    accion.subscribe({
      next: () => {
        this.ocupado.set(false);
        this.router.navigateByUrl(this.destino);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.ocupado.set(false);
      },
    });
  }
}
