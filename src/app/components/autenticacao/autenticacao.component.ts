import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-autenticacao',
  templateUrl: './autenticacao.component.html',
  styleUrl: './autenticacao.component.css'
})
export class AutenticacaoComponent implements OnInit { 
  formulario: any;
  errors!: string[];

  constructor(private autenticacaoService: AutenticacaoService, private router: Router) {   
  }

  ngOnInit(): void {
    this.errors = [];
    this.formulario = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(50)]),
      senha: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)])
    });
  }

  get GetPropriedades() {
    return this.formulario.controls;
  }

  Enviarformulario(): void {
    this.errors = [];
    let dadosLogin = this.formulario.value;
    this.autenticacaoService.LogarUsuario(dadosLogin).subscribe(resposta => {

      console.log(resposta);
      debugger;
      let emailUsuario = resposta.data.email;
      let usuarioId = resposta.data.usuarioId;
      let tokenUsuario = resposta.data.token;
      localStorage.setItem('EmailUsuarioLogado', emailUsuario);
      localStorage.setItem('UsuarioId', usuarioId);
      localStorage.setItem('tokenUsuario', tokenUsuario);

      this.router.navigate(['/usuario-lista']);
    }, (err) => {
      if (err.status === 400) {
        for (const campo in err.error.errors) {
          if (err.error.errors.hasOwnProperty(campo)) {
            this.errors.push(err.error.errors[campo]);
          }
        }
      } else {
        this.errors.push(err.error);
      }
    });
  }

}
