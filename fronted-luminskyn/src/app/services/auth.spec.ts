import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';
describe('AuthService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }),
  );
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('renueva CSRF después de entrar y guarda solo el perfil en memoria', () => {
    const http = TestBed.inject(HttpTestingController),
      auth = TestBed.inject(AuthService);
    auth.login(' USER@EXAMPLE.COM ', 'Password123').subscribe();
    http.expectOne('/api/auth/csrf').flush({ token: 'a' });
    const login = http.expectOne('/api/auth/login');
    expect(login.request.body.get('email')).toBe('user@example.com');
    login.flush({ id: 1, nombre: 'Ana', email: 'user@example.com' });
    expect(auth.usuario()).toBeNull();
    http.expectOne('/api/auth/csrf').flush({ token: 'b' });
    expect(auth.usuario()?.nombre).toBe('Ana');
  });
});
