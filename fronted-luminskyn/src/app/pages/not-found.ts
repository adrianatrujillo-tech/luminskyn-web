import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true,
  imports: [RouterLink],
  template: `<main id="contenido" class="page">
    <section class="panel">
      <p class="eyebrow">404</p>
      <h1>No encontramos esta página</h1>
      <p>Revisa la dirección o vuelve al catálogo.</p>
      <a class="button" routerLink="/tienda">Ir al catálogo</a>
    </section>
  </main>`,
})
export class NotFound {}
