import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { cuentaGuard } from './services/auth';
export const routes: Routes = [
  { path: '', component: Inicio, title: 'LuminSkyn | Cuidado personal' },
  {
    path: 'tienda',
    loadComponent: () => import('./pages/tienda/tienda').then((m) => m.Tienda),
    title: 'Catálogo | LuminSkyn',
  },
  {
    path: 'producto/:id',
    loadComponent: () => import('./pages/producto/producto').then((m) => m.ProductoPage),
    title: 'Producto | LuminSkyn',
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito').then((m) => m.Carrito),
    title: 'Carrito | LuminSkyn',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/auth').then((m) => m.AuthPage),
    title: 'Iniciar sesión | LuminSkyn',
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/auth/auth').then((m) => m.AuthPage),
    data: { registro: true },
    title: 'Crear cuenta | LuminSkyn',
  },
  {
    path: 'cuenta',
    canActivate: [cuentaGuard],
    loadComponent: () => import('./pages/cuenta/cuenta').then((m) => m.Cuenta),
    title: 'Mi cuenta | LuminSkyn',
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto').then((m) => m.Contacto),
    title: 'Contacto | LuminSkyn',
  },
  {
    path: 'ayuda/:tema',
    loadComponent: () => import('./pages/ayuda/ayuda').then((m) => m.Ayuda),
    title: 'Ayuda | LuminSkyn',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found').then((m) => m.NotFound),
    title: 'Página no encontrada | LuminSkyn',
  },
];
