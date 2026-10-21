import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, CanActivateFn } from '@angular/router';
import { catchError, of, switchMap, tap, timeout } from 'rxjs';
import { ApiService } from './api';
export interface Perfil {
  id: number;
  nombre: string;
  email: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private api = inject(ApiService);
  readonly usuario = signal<Perfil | null>(null);
  inicializar() {
    return this.api.csrf().pipe(
      switchMap(() => this.http.get<Perfil>('/api/auth/yo')),
      tap((u) => this.usuario.set(u)),
      timeout(8000),
      catchError(() => {
        this.usuario.set(null);
        return of(null);
      }),
    );
  }
  login(email: string, password: string) {
    const body = new HttpParams()
      .set('email', email.trim().toLowerCase())
      .set('password', password);
    return this.api.csrf().pipe(
      switchMap(() => this.http.post<Perfil>('/api/auth/login', body)),
      switchMap((u) => this.api.csrf().pipe(tap(() => this.usuario.set(u)))),
    );
  }
  registro(nombre: string, email: string, password: string) {
    return this.api.post<Perfil>('/api/auth/registro', {
      nombre: nombre.trim(),
      email: email.trim(),
      password,
    });
  }
  logout() {
    return this.api.post<void>('/api/auth/logout', {}).pipe(
      tap(() => this.usuario.set(null)),
      switchMap(() => this.api.csrf()),
    );
  }
}
export const cuentaGuard: CanActivateFn = (_, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.usuario()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
