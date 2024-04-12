import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Produto } from '../../models/Produto';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto-lista',
  templateUrl: './produto-lista.component.html',
  styleUrl: './produto-lista.component.css'
})
export class ProdutoListaComponent implements OnInit {

  produtosList = new MatTableDataSource<Produto>();
  displayColumns: string[] | undefined;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator | undefined;

  @ViewChild(MatSort, { static: false })
  sort: MatSort | undefined

  constructor(private produtoService: ProdutoService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.produtoService.RetornarTodosProdutos().subscribe(resultado => {
      var resultadoList: Produto[] = [];
      resultadoList = resultado.data;
      this.produtosList.data = resultadoList;

      this.produtosList.sort = this.sort;

      this.produtosList.paginator = this.paginator;
    });

    this.displayColumns = this.ExibirColunas();

  }

  ExibirColunas(): string[] {
    return ['Codigo', 'FornecedorCodigo', 'Nome', 'Valor', 'Ativo', 'Acoes'];
  }

  AbrirDialog(produtoId: number, nome: string): void {
    this.dialog.open(DialogExclusaoProdutoComponent, {
      data: {
        produtoId: produtoId,
        nome: nome
      }
    }).afterClosed().subscribe(resultado => {
      debugger;
      console.log('=================================>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + resultado);
      if (resultado === true) {
        setTimeout(() => {
          this.produtoService.RetornarTodosProdutos().subscribe(resposta => {
            console.log('retorno =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            console.log(resposta);
            debugger;
            this.produtosList.data = resposta.data;
          });

        }, 2000);
      }
    });
  }

}

@Component({
  selector: 'app-dialog-exclusao-produto',
  templateUrl: './dialog-exclusao-produto.html'
})
export class DialogExclusaoProdutoComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public dados: any,
    private produtoService: ProdutoService,
    private snackBar: MatSnackBar) {

  }

  ExcluirProduto(produtoId: number): void {
    this.produtoService.AtivarDesativarProduto(produtoId).subscribe(resposta => {
      debugger;
      console.log(resposta);
      this.snackBar.open(resposta.message, null, {
        duration: 7000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    });
  }
}
