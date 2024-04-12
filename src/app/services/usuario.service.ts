import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url: string = "";

  constructor(private http: HttpClient, private apiConfigService: ApiConfigService) {
    this.url = this.apiConfigService.ObterUrlApi();
  }

  RetornarUsuario(codigo: number): Observable<any> {
    let apiUrl = `${this.url}/Usuario/RetornarUsuario?codigo=${codigo}`;

    return this.http.get<Usuario>(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain',
        'Authorization': `Bearer ${localStorage.getItem('tokenUsuario')}`
      }, params: {}, responseType: 'json'
    });
  }

  AdicionarUsuario(dados: Usuario): Observable<any> {
    let apiUrl = `${this.url}/Usuario/AdicionarUsuario`;

    return this.http.post<Usuario>(apiUrl, dados);
  }

  AlterarUsuario(dados: Usuario): Observable<any> {
    let apiUrl = `${this.url}/Usuario/AlterarUsuario`;

    return this.http.put<Usuario>(apiUrl, dados, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain',
        'Authorization': `Bearer ${localStorage.getItem('tokenUsuario')}`
      }, params: {}, responseType: 'json'
    });
  }

}
