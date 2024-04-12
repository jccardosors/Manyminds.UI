import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from './api-config.service';
import { Observable } from 'rxjs';
import { RetornarListaPedidoCompraResponse } from '../models/response/RetornarListaPedidoCompraResponse';

@Injectable({
  providedIn: 'root'
})
export class PedidoCompraService {
  url: string = "";

  constructor(private http: HttpClient, private apiConfigService: ApiConfigService) {
    this.url = this.apiConfigService.ObterUrlApi();
  }

  RetornarPedidosLista(): Observable<RetornarListaPedidoCompraResponse> {
    let apiUrl = `${this.url}/PedidoCompra/RetornarPedidosLista`;

    var resposta = this.http.get<any>(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain',
        'Authorization': `Bearer ${localStorage.getItem('tokenUsuario')}`
      }, params: {}, responseType: 'json'
    });

    console.log(resposta);

    return resposta;
  }
}
