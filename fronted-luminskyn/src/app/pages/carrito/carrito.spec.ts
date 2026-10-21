import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Carrito } from './carrito';
describe('Carrito', () => {
  it('ofrece volver a la tienda cuando está vacío', async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Carrito],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const f = TestBed.createComponent(Carrito);
    f.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('/api/productos').flush([]);
    await f.whenStable();
    expect(f.nativeElement.textContent).toContain('Tu carrito está vacío');
  });
});
