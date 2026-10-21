import { Injectable } from '@angular/core';
// 👉 Permite que esta clase funcione como un servicio en Angular
// 👉 Sin esto, no podrías usarlo en otros componentes

import { HttpClient } from '@angular/common/http';
// 👉 Herramienta para hacer peticiones al backend (GET, POST, etc.)

@Injectable({
  providedIn: 'root'
  // 👉 Hace que este servicio esté disponible en TODA la aplicación
  // 👉 No necesitas importarlo manualmente en cada lugar
})

export class ApiService {

  private url = 'http://localhost:8080/api/pedidos';
  // 👉 URL del backend (donde está tu API)
  // 👉 Aquí se enviarán los pedidos

  constructor(private http: HttpClient) {}
  // 👉 Angular inyecta HttpClient automáticamente
  // 👉 Lo guardamos en "http" para usarlo en métodos

  enviarPedido(pedido: any) {
    // 👉 Método que se encarga de enviar datos al backend

    return this.http.post(this.url, pedido);
    // 👉 Hace una petición POST (envía datos)
    // 👉 this.url → dirección del backend
    // 👉 pedido → datos que estás enviando

    // 👉 Devuelve una respuesta (Observable)
    // 👉 Luego se usa .subscribe() en el componente para recibirla
  }

}
