import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from './api-config.service';
import { Observable } from 'rxjs';
import { FornecedorResponse } from '../models/response/FornecedorResponse';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService  {
  url: string = "";

  constructor(private http: HttpClient, private apiConfigService: ApiConfigService) {
    this.url = this.apiConfigService.ObterUrlApi();
  }

  RetornarTodosFornecedores(): Observable<FornecedorResponse> {
    let apiUrl = `${this.url}/Fornecedor/RetornarTodosFornecedores`;

    var resposta = this.http.get<any>(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain',
        'Authorization': `Bearer ${localStorage.getItem('tokenUsuario')}`
      }, params: {}, responseType: 'json'
    });
   
    return resposta;
  }
}
