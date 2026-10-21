import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// 👇 IMPORTA TUS COMPONENTES
import { HeaderComponent } from './shared/header/header';
import { FooterComponent } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true, // 👈 IMPORTANTE (si no está, agrégalo)

  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],

  templateUrl: './app.html',
  styleUrls: ['./app.css'] // 👈 corrige esto (era styleUrl)
})
export class App {
  protected readonly title = signal('fronted-luminskyn');
}
