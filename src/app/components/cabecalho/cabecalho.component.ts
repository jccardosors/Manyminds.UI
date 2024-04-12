import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.css'
})
export class CabecalhoComponent  implements OnInit {
  emailUsuarioLogado = localStorage.getItem('EmailUsuarioLogado');

  constructor(private router: Router) {  }

  ngOnInit(): void {
  }

  EfetuarLogout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
