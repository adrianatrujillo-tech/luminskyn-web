import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'], // ✔️ corregido
})
export class FooterComponent { // ✔️ nombre correcto

  // 🟢 VARIABLE DEL INPUT
  correo: string = '';

  // 🟢 FUNCIÓN DEL FORMULARIO
  suscribirse() {
    if (!this.correo.trim()) return;

    console.log("Correo suscrito:", this.correo);

    // limpiar campo
    this.correo = '';
  }

}
