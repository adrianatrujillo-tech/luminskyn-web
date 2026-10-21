import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'], 
})
export class HeaderComponent { 

  constructor(private carritoService: CarritoService) {}

  // 🛒 CONTADOR DINÁMICO
  get cantidadCarrito(): number {
    return this.carritoService.cantidadTotal();
  }

}
