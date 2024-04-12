import { Injectable } from '@angular/core';
import { ApiConfigService } from './api-config.service';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/Usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  url: string = "";

  constructor(private http: HttpClient, private apiConfigService: ApiConfigService) {
    this.url = this.apiConfigService.ObterUrlApi();
  }

  LogarUsuario(dadosLogin: Usuario): Observable<any> {
    debugger;
    let apiUrl = `${this.url}/Autenticacao/Autenticar`;
    return this.http.post<Usuario>(apiUrl, dadosLogin);
  }
}
