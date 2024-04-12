import { Component, OnInit } from '@angular/core';
import { Fornecedor } from '../../models/Fornecedor';
import { FornecedorService } from '../../services/fornecedor.service';
import { ProdutoService } from '../../services/produto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-produto-edicao',
  templateUrl: './produto-edicao.component.html',
  styleUrl: './produto-edicao.component.css'
})
export class ProdutoEdicaoComponent implements OnInit {

  formulario: any;
  fornecedorList: Fornecedor[] | undefined;
  errors: string[] = [];
  produtoId: number = 0;
  nomeProduto: string;

  constructor(private fornecedorService: FornecedorService, private produtoService: ProdutoService, private router: Router,
    private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.errors = [];
    this.produtoId = this.route.snapshot.params.codigo;

    this.fornecedorService.RetornarTodosFornecedores().subscribe(response => {
      this.fornecedorList = response.data;
    });

    this.CarregarFormulario();
  }

  get GetPropriedades() {
    return this.formulario.controls;
  }

  CarregarFormulario(): void {
    this.produtoService.RetornarProduto(this.produtoId).subscribe(resposta => {
      console.log(resposta.data);
      var produto = resposta.data;
      this.nomeProduto = produto.nome;

      this.formulario = new FormGroup({
        nome: new FormControl(produto.nome, [Validators.required, Validators.maxLength(50)]),
        valor: new FormControl(produto.valor, [Validators.required, Validators.maxLength(15)]),
        fornecedorCodigo: new FormControl(produto.fornecedorCodigo, [Validators.required]),
        ativo: new FormControl(produto.ativo, [Validators.required]),
      });
    });
  }

  EnviarFormulario(): void {
    this.errors = [];
    let usuario = this.formulario.value;
    usuario.codigo = this.produtoId;

    this.produtoService.AlterarProduto(usuario).subscribe(resposta => {
      var dados = resposta.data;

      console.log(resposta.data);
      debugger;
      this.router.navigate(['/produto-lista']);

      this.snackBar.open(resposta.message, null, {
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

  VoltarListagem(): void {
    this.router.navigate(['/produto-lista']);
  }

}
