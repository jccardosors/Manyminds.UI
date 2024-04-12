import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  constructor() { }

  ObterUrlApi(): string {
    return "https://localhost:7124/api";
  }

  ObterCodigoUsuario(): any {
    return localStorage.getItem('UsuarioId');
  }

}
