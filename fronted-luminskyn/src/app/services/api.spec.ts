import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api';
describe('ApiService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }),
  );
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('obtiene CSRF antes de enviar un pedido a la misma aplicación', () => {
    const http = TestBed.inject(HttpTestingController);
    TestBed.inject(ApiService).enviarPedido({ clave: 'prueba' }).subscribe();
    http.expectOne('/api/auth/csrf').flush({ token: 'csrf' });
    const req = http.expectOne('/api/pedidos');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1 });
  });
});
