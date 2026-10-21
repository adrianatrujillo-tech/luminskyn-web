import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
@Component({
  standalone: true,
  imports: [RouterLink],
  template: `<main id="contenido" class="page">
    <article class="panel prose">
      <p class="eyebrow">INFORMACIÓN DEL PROYECTO</p>
      <h1>{{ contenido().titulo }}</h1>
      @for (p of contenido().parrafos; track p) {
        <p>{{ p }}</p>
      }
      <a class="button" routerLink="/contacto">Registrar una consulta</a>
    </article>
  </main>`,
})
export class Ayuda {
  private route = inject(ActivatedRoute);
  private textos: Record<string, { titulo: string; parrafos: string[] }> = {
    privacidad: {
      titulo: 'Privacidad',
      parrafos: [
        'LuminSkyn es un proyecto de portafolio. Usa datos ficticios para las pruebas.',
        'La cuenta guarda nombre, correo y una contraseña cifrada mediante hash. Los pedidos guardan el detalle, teléfono y dirección introducidos. La sesión utiliza una cookie; el carrito se guarda en este navegador.',
        'Las solicitudes y suscripciones se guardan en la base de datos del proyecto. No se conectan con un servicio de correo ni con redes sociales. No introduzcas información bancaria.',
        'Antes de un lanzamiento comercial deben definirse el responsable, los canales de atención y la política aplicable al negocio.',
      ],
    },
    terminos: {
      titulo: 'Cómo funciona LuminSkyn',
      parrafos: [
        'Esta es una tienda de demostración para un portafolio universitario. El catálogo y el stock inicial son datos de prueba.',
        'Puedes crear una cuenta, agregar productos al carrito y registrar pedidos contra entrega. No se procesan tarjetas, transferencias ni envíos reales.',
        'El servidor comprueba las cantidades, calcula el total y guarda el pedido asociado a tu cuenta. Los productos agotados no se pueden pedir.',
      ],
    },
    devoluciones: {
      titulo: 'Consultas sobre pedidos',
      parrafos: [
        'Consulta el número y el estado de tus pedidos en Mi cuenta.',
        'Si necesitas registrar una consulta, utiliza el formulario de contacto e incluye el número del pedido. Las consultas quedan guardadas para revisión manual.',
        'Este proyecto no realiza despachos reales. Las condiciones comerciales de cambios y devoluciones se definirán antes de utilizarlo como una tienda real.',
      ],
    },
    rutina: {
      titulo: 'Explora tu rutina',
      parrafos: [
        'Organizamos los productos por limpieza, hidratación, protección, tratamiento y accesorios para facilitar la búsqueda.',
        'Revisa las instrucciones e ingredientes del fabricante. El catálogo no asigna productos a tipos de piel sin información del fabricante.',
        'Puedes buscar y comparar productos en el catálogo.',
      ],
    },
  };
  contenido = signal(this.textos['terminos']);
  constructor() {
    this.route.paramMap.subscribe((p) =>
      this.contenido.set(this.textos[p.get('tema') || 'terminos'] || this.textos['terminos']),
    );
  }
}
