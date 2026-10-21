import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HeaderComponent } from './header';
describe('HeaderComponent', () => {
  it('abre y cierra el menú móvil', async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
    const f = TestBed.createComponent(HeaderComponent);
    await f.whenStable();
    f.nativeElement.querySelector('button').click();
    await f.whenStable();
    expect(f.nativeElement.querySelector('nav').classList.contains('open')).toBe(true);
  });
});
