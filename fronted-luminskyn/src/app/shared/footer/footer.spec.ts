import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FooterComponent } from './footer';
describe('FooterComponent', () => {
  it('no envía una suscripción sin consentimiento', async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const f = TestBed.createComponent(FooterComponent);
    await f.whenStable();
    f.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await f.whenStable();
    TestBed.inject(HttpTestingController).expectNone('/api/suscripciones');
    expect(f.componentInstance.mensaje()).toContain('válido');
  });
});
