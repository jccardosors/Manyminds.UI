import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from './api-config.service';
import { Observable } from 'rxjs';
import { RetornarListaLogsResponse } from '../models/response/RetornarListaLogsResponse';

@Injectable({
  providedIn: 'root'
})
export class RegistroLogsService {
  url: string = "";

  constructor(private http: HttpClient, private apiConfigService: ApiConfigService) {
    this.url = this.apiConfigService.ObterUrlApi();
  }

  RetornarTodosLogs(): Observable<RetornarListaLogsResponse> {
    let apiUrl = `${this.url}/RegistroLogs/RetornarTodosLogs`;

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
