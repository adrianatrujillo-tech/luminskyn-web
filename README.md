# LuminSkyn

Tienda de cuidado personal para portafolio: Angular 21, Java 17, Spring Boot y MySQL. Conserva el frontend en `fronted-luminskyn` (nombre original) y el backend en `backend-luminskyn`.

## Qué funciona

- Registro con correo único y contraseña protegida con BCrypt; inicio/cierre de sesión mediante cookie HttpOnly y protección CSRF.
- Catálogo en MySQL con 12 productos de demostración, búsqueda, categorías, ofertas y detalle de producto.
- Cantidades independientes por producto; carrito persistente en el navegador, actualización de precios y disponibilidad.
- Pedido contra entrega con datos de contacto, total calculado en el servidor, comprobación y descuento de stock transaccionales.
- Reintentos del mismo pedido sin duplicar la compra. Historial privado por cuenta.
- Cotizaciones y suscripciones con consentimiento guardadas en MySQL; mensajes de éxito y de error.
- Menú móvil, navegación y enlaces del pie de página, página 404 y estados vacíos.

## Ejecutar en Windows

Requisitos: Node.js compatible con Angular 21 (por ejemplo Node 22.12 o superior dentro de la versión 22), JDK 17 y MySQL 8.4 en el puerto 3306. No necesitas XAMPP ni instalar Maven por separado.

En MySQL Workbench ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS luminskyn;
```

Abre PowerShell dentro de la carpeta del repositorio. Primera terminal:

```powershell
cd .\backend-luminskyn
$credencialMySQL = Read-Host "Contraseña de MySQL root" -AsSecureString
$env:SPRING_DATASOURCE_PASSWORD = [System.Net.NetworkCredential]::new("", $credencialMySQL).Password
.\mvnw.cmd spring-boot:run
```

El usuario predeterminado es `root`. Para cambiarlo, define `$env:SPRING_DATASOURCE_USERNAME`. Para cambiar host, puerto o base, define `$env:SPRING_DATASOURCE_URL` con una URL JDBC. La contraseña se solicita de nuevo al abrir otra terminal; nunca la escribas en archivos rastreados por Git.

Segunda terminal, también desde la raíz del repositorio:

```powershell
cd .\fronted-luminskyn
npm ci
npm start
```

Abre **http://localhost:4200**. Mantén ambas terminales abiertas. El frontend usa el proxy de desarrollo `/api` hacia `127.0.0.1:8080`; reinicia `npm start` después de actualizar `proxy.conf.json`.

La primera ejecución crea las tablas faltantes y agrega los productos que no existan. No reemplaza productos existentes ni reinicia su stock. Los pedidos antiguos sin cuenta se conservan en la base, pero no se asignan a nuevas cuentas.

## Prueba manual

1. Abre Registro, crea una cuenta e inicia sesión.
2. Agrega dos productos distintos; cambia sus cantidades y recarga la página.
3. En Carrito, completa nombre, teléfono y dirección; confirma el pedido.
4. Abre Mi cuenta y verifica su detalle y total. Recarga y comprueba que continúa la sesión.
5. Cierra sesión y comprueba que se solicita iniciar sesión para acceder a Mi cuenta.
6. Registra una cotización y una suscripción. Comprueba sus registros en las tablas `cotizacion` y `suscripcion` de MySQL.

No hay cuentas ni contraseñas predeterminadas.

## Verificación automatizada

```powershell
# Dentro de backend-luminskyn
.\mvnw.cmd test

# Dentro de fronted-luminskyn
npm test
npm run build
npm audit
```

Las pruebas de integración usan H2 con modo MySQL y no necesitan ni alteran tu MySQL. Verifican credenciales, validación, CSRF, precios, stock, reintentos y separación de pedidos entre usuarios. La aplicación usa MySQL en su ejecución normal.

## Alcance de esta versión

Es una demostración funcional para portafolio. El catálogo tiene precios y stock de prueba. Los pedidos se registran como `PENDIENTE` y `CONTRA_ENTREGA`: **no se cobran tarjetas ni se gestionan envíos reales**. Las cotizaciones y suscripciones se guardan para revisión manual; no se envían correos ni existe un panel de administración. No hay recuperación de contraseñas por correo.

Para operar un negocio real se deben conectar pagos, gestión de inventario y pedidos, correo, envíos y condiciones comerciales del negocio. Las páginas de ayuda describen el proyecto, no sustituyen las políticas de una tienda comercial.

La aplicación es una SPA. Para publicarla, sirve `dist/fronted-luminskyn/browser`, configura la redirección de rutas a `index.html` y un proxy del mismo dominio para `/api`. Usa HTTPS y `COOKIE_SECURE=true`. Las sesiones se invalidan al reiniciar el backend.

## Guardar cambios

```powershell
git add .
git commit -m "Describe los cambios"
git push
```

Si una contraseña se incluyó alguna vez en Git, reemplazarla por una variable no la borra del historial: cambia esa contraseña y evita reutilizarla.
