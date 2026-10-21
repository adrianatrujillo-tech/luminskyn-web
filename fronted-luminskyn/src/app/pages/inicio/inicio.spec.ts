import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Inicio } from './inicio';
describe('Inicio', () => {
  it('explica cuando no está disponible el catálogo', async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const f = TestBed.createComponent(Inicio);
    f.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne('/api/productos')
      .flush('offline', { status: 503, statusText: 'Unavailable' });
    await f.whenStable();
    expect(f.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
  });
});
