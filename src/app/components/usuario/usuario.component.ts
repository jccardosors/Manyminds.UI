import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../models/Usuario';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  formulario: any;
  errors: string[]

  constructor(private usuarioServico: UsuarioService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.errors = [];
    this.formulario = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]),
      senha: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
    });
  }

  get GetPropriedades() {
    return this.formulario.controls;
  }

  VoltarLogin(): void {
    this.router.navigate(['/login']);
  }

  EnviarFormulario(): void {
    this.errors = [];
    let usuario = this.formulario.value;

    this.usuarioServico.AdicionarUsuario(usuario).subscribe(resp => {

      debugger;
      this.router.navigate(['/login']);

      this.snackBar.open(resp.message, null, {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });

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
