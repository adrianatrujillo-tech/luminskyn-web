import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Carrito } from './pages/carrito/carrito';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'carrito', component: Carrito }
];