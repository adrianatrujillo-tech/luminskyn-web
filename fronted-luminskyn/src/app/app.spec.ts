import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app';
describe('App', () => {
  it('muestra navegación y pie de página de LuminSkyn', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
    const f = TestBed.createComponent(App);
    await f.whenStable();
    expect(f.nativeElement.textContent).toContain('LuminSkyn');
    expect(f.nativeElement.querySelector('a[href="/login"]')).toBeTruthy();
  });
});
