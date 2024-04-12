import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuario-edicao',
  templateUrl: './usuario-edicao.component.html',
  styleUrl: './usuario-edicao.component.css'
})
export class UsuarioEdicaoComponent implements OnInit {

  formulario: any;
  errors: string[]
  usuarioId: number = 0;
  emailUsuario: string;

  constructor(private usuarioServico: UsuarioService, private router: Router,
    private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.errors = [];
    this.usuarioId = this.route.snapshot.params.codigo;

    this.CarregarFormulario();
  }

  get GetPropriedades() {
    return this.formulario.controls;
  }

  CarregarFormulario(): void {
    this.usuarioServico.RetornarUsuario(this.usuarioId).subscribe(resposta => {
      console.log(resposta.data);
      var usuario = resposta.data;
      this.emailUsuario = usuario.email;

      this.formulario = new FormGroup({
        email: new FormControl(usuario.email, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]),
        senha: new FormControl(usuario.senha, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
      });
    });
  }

  VoltarLogin(): void {
    this.router.navigate(['/usuario-lista']);
  }

  EnviarFormulario(): void {
    this.errors = [];
    let usuario = this.formulario.value;
    usuario.codigo = this.usuarioId;

    this.usuarioServico.AlterarUsuario(usuario).subscribe(resposta => {
      var dados = resposta.data;
       let emailUsuarioLogado = dados.email;      
       let tokenUsuario = dados.token;
       localStorage.setItem('EmailUsuarioLogado', emailUsuarioLogado);
       localStorage.setItem('UsuarioId', usuario.codigo);
       localStorage.setItem('TokenUsuario', tokenUsuario);

        console.log(tokenUsuario);
      debugger;
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
