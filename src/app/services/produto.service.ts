import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from './api-config.service';
import { Observable } from 'rxjs';
import { Produto } from '../models/Produto';
import { ProdutoResponse } from '../models/response/ProdutoResponse';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  url: string = "";

  constructor(private http: HttpClient, private apiConfigService: ApiConfigService) {
    this.url = this.apiConfigService.ObterUrlApi();
  }

  RetornarTodosProdutos(): Observable<ProdutoResponse> {
    let apiUrl = `${this.url}/Produto/RetornarTodosProdutos`;

    var resposta = this.http.get<any>(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain',
        'Authorization': `Bearer ${localStorage.getItem('tokenUsuario')}`
      }, params: {}, responseType: 'json'
    });
   
    return resposta;
  }

  AdicionarProduto(item: Produto): Observable<any> {
    item.codigo = 0;
    let apiUrl = `${this.url}/Produto/AdicionarProduto`;

    return this.http.post<any>(apiUrl, item, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain',
        'Authorization': `Bearer ${localStorage.getItem('tokenUsuario')}`
      }, params: {}, responseType: 'json'
    });
  }

  RetornarProduto(codigo: number): Observable<any> {
    let apiUrl = `${this.url}/Produto/RetornarProduto?codigo=${codigo}`;

    return this.http.get<Produto>(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain',
        'Authorization': `Bearer ${localStorage.getItem('tokenUsuario')}`
      }, params: {}, responseType: 'json'
    });
  }

  AlterarProduto(dados: Produto): Observable<any> {
    let apiUrl = `${this.url}/Produto/AlterarProduto`;

    return this.http.put<Produto>(apiUrl, dados, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain',
        'Authorization': `Bearer ${localStorage.getItem('tokenUsuario')}`
      }, params: {}, responseType: 'json'
    });
  }

  AtivarDesativarProduto(codigo: number): Observable<any> {   
    debugger;
    let apiUrl = `${this.url}/Produto/AtivarDesativarProduto?codigo=${codigo}`;

    return this.http.delete<any>(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain',
        'Authorization': `Bearer ${localStorage.getItem('tokenUsuario')}`
      }, params: {}, responseType: 'json'
    });
  }
}
