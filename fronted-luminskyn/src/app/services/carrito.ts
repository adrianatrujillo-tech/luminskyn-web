import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ItemCarrito, Producto } from './api';
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly items = signal<ItemCarrito[]>([]);
  constructor() {
    if (this.browser)
      try {
        const data: unknown = JSON.parse(localStorage.getItem('luminskyn-carrito') || '[]');
        if (Array.isArray(data))
          this.items.set(
            data
              .filter(
                (p) =>
                  p &&
                  Number.isSafeInteger(p.id) &&
                  p.id > 0 &&
                  Number.isInteger(p.cantidad) &&
                  p.cantidad >= 1 &&
                  p.cantidad <= 99 &&
                  Number.isFinite(p.precio) &&
                  p.precio >= 0 &&
                  typeof p.nombre === 'string' &&
                  Number.isInteger(p.stock),
              )
              .map((p) => ({ ...p })),
          );
      } catch {
        this.items.set([]);
      }
  }
  private guardar() {
    if (this.browser)
      try {
        localStorage.setItem('luminskyn-carrito', JSON.stringify(this.items()));
      } catch {
        /* El carrito sigue disponible en memoria. */
      }
  }
  obtener() {
    return this.items();
  }
  agregar(p: Producto, cantidad = 1) {
    if (!Number.isInteger(cantidad) || cantidad < 1) return;
    const existente = this.items().find((x) => x.id === p.id);
    const total = (existente?.cantidad || 0) + cantidad;
    if (total > Math.min(p.stock, 99))
      throw new Error('No hay suficiente stock para esa cantidad.');
    this.items.update((xs) =>
      existente
        ? xs.map((x) => (x.id === p.id ? { ...p, cantidad: total } : x))
        : [...xs, { ...p, cantidad }],
    );
    this.guardar();
  }
  eliminar(id: number) {
    this.items.update((xs) => xs.filter((x) => x.id !== id));
    this.guardar();
  }
  aumentar(id: number) {
    this.items.update((xs) =>
      xs.map((x) => (x.id === id ? { ...x, cantidad: Math.min(x.cantidad + 1, x.stock, 99) } : x)),
    );
    this.guardar();
  }
  disminuir(id: number) {
    this.items.update((xs) =>
      xs.map((x) => (x.id === id ? { ...x, cantidad: Math.max(1, x.cantidad - 1) } : x)),
    );
    this.guardar();
  }
  vaciar() {
    this.items.set([]);
    this.guardar();
  }
  total() {
    return Math.round(this.items().reduce((s, p) => s + p.precio * p.cantidad, 0) * 100) / 100;
  }
  cantidadTotal() {
    return this.items().reduce((s, p) => s + p.cantidad, 0);
  }
  reconciliar(productos: Producto[]) {
    let cambio = false;
    const actualizados: ItemCarrito[] = [];
    for (const i of this.items()) {
      const p = productos.find((p) => p.id === i.id);
      if (!p || p.stock < 1) {
        cambio = true;
        continue;
      }
      const cantidad = Math.min(i.cantidad, p.stock, 99);
      if (cantidad !== i.cantidad || i.precio !== p.precio) cambio = true;
      actualizados.push({ ...p, cantidad });
    }
    this.items.set(actualizados);
    this.guardar();
    return cambio;
  }
}
