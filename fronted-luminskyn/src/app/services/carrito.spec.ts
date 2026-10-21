import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito';
import { Producto } from './api';
const producto: Producto = {
  id: 1,
  nombre: 'Sérum',
  precio: 49.9,
  imagen: '',
  categoria: 'Hidratación',
  descripcion: '',
  nuevo: true,
  oferta: false,
  stock: 5,
};
describe('CarritoService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });
  it('mantiene productos distintos y calcula importes exactos', () => {
    const c = TestBed.inject(CarritoService);
    c.agregar(producto, 2);
    c.agregar({ ...producto, id: 2, nombre: 'Crema', precio: 39.9 }, 1);
    expect(c.items().length).toBe(2);
    expect(c.total()).toBe(139.7);
    expect(c.cantidadTotal()).toBe(3);
  });
  it('impide exceder el stock y cantidades inválidas', () => {
    const c = TestBed.inject(CarritoService);
    c.agregar(producto, 5);
    expect(() => c.agregar(producto, 1)).toThrow();
    c.aumentar(1);
    expect(c.items()[0].cantidad).toBe(5);
    c.agregar(producto, -2);
    expect(c.items()[0].cantidad).toBe(5);
  });
  it('recupera almacenamiento corrupto sin romper la página', () => {
    localStorage.setItem('luminskyn-carrito', 'broken-json');
    const c = TestBed.inject(CarritoService);
    expect(c.items()).toEqual([]);
  });
  it('actualiza stock y precio sin conservar valores manipulados', () => {
    const c = TestBed.inject(CarritoService);
    c.agregar(producto, 4);
    expect(c.reconciliar([{ ...producto, stock: 2, precio: 55 }])).toBe(true);
    expect(c.total()).toBe(110);
    expect(c.items()[0].cantidad).toBe(2);
  });
  it('conserva el carrito al recargar y permite vaciarlo', () => {
    const c = TestBed.inject(CarritoService);
    c.agregar(producto);
    expect(JSON.parse(localStorage.getItem('luminskyn-carrito')!)[0].id).toBe(1);
    c.vaciar();
    expect(JSON.parse(localStorage.getItem('luminskyn-carrito')!)).toEqual([]);
  });
});
