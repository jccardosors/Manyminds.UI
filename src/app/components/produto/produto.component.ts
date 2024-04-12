import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fornecedor } from '../../models/Fornecedor';
import { FornecedorService } from '../../services/fornecedor.service';
import { ProdutoService } from '../../services/produto.service';
import { UtilsService } from '../../services/utils.service';


@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.css'
})
export class ProdutoComponent implements OnInit {

  formulario: any;
  fornecedorList: Fornecedor[] | undefined;
  errors: string[] = [];

  constructor(private fornecedorService: FornecedorService, private produtoService: ProdutoService, private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.errors = [];
    this.fornecedorService.RetornarTodosFornecedores().subscribe(response => {
      this.fornecedorList = response.data;
    });

    this.formulario = new FormGroup({
      nome: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      valor: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
      fornecedorCodigo: new FormControl(null, [Validators.required]),
      ativo: new FormControl(null, [Validators.required]),
    });
  }

  EnviarFormulario(): void {
    this.errors = [];
    let produto = this.formulario.value;
    this.produtoService.AdicionarProduto(produto).subscribe(response => {

      this.router.navigate(['/produto-lista']);

      this.snackBar.open(response.message, null, {
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
      }
    });
  }

  get propriedade() {
    return this.formulario.controls;
  }

  VoltarListagem(): void {
    this.router.navigate(['/produto-lista']);
  }

}
