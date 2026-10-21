import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { switchMap } from 'rxjs';
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string;
  nuevo: boolean;
  oferta: boolean;
  stock: number;
}
export interface ItemCarrito extends Producto {
  cantidad: number;
}
export interface Detalle {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
}
export interface Pedido {
  id: number;
  items: Detalle[];
  total: number;
  fecha: string;
  nombre: string;
  telefono: string;
  direccion: string;
  estado: string;
  pago: string;
}
export function mensajeError(e: unknown): string {
  if (e instanceof HttpErrorResponse) {
    if (e.status === 0 || e.status === 502 || e.status === 504)
      return 'No podemos conectar con el servidor. Comprueba que el backend esté encendido e inténtalo de nuevo.';
    if (e.status === 401) return 'Inicia sesión para continuar. Tu sesión puede haber caducado.';
    return e.error?.message || 'No se pudo completar la operación. Inténtalo nuevamente.';
  }
  return 'Ocurrió un error. Inténtalo nuevamente.';
}
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  csrf() {
    return this.http.get('/api/auth/csrf');
  }
  productos() {
    return this.http.get<Producto[]>('/api/productos');
  }
  producto(id: number) {
    return this.http.get<Producto>('/api/productos/' + id);
  }
  post<T>(url: string, body: unknown) {
    return this.csrf().pipe(switchMap(() => this.http.post<T>(url, body)));
  }
  enviarPedido(pedido: unknown) {
    return this.post<Pedido>('/api/pedidos', pedido);
  }
  pedidos() {
    return this.http.get<Pedido[]>('/api/pedidos');
  }
}
