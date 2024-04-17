import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PedidoCompra } from '../../models/PedidoCompra';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PedidoCompraService } from '../../services/pedido-compra.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pedido-compra-lista',
  templateUrl: './pedido-compra-lista.component.html',
  styleUrl: './pedido-compra-lista.component.css'
})
export class PedidoCompraListaComponent implements OnInit {

  pedidoCompraList = new MatTableDataSource<PedidoCompra>();
  displayColumns: string[] | undefined;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator | undefined;

  @ViewChild(MatSort, { static: false })
  sort: MatSort | undefined

  constructor(private pedidoCompraService: PedidoCompraService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.pedidoCompraService.RetornarPedidosLista().subscribe(resultado => {
      
      this.pedidoCompraList.data = resultado.data;

      this.pedidoCompraList.sort = this.sort;

      this.pedidoCompraList.paginator = this.paginator;
    });

    this.displayColumns = this.ExibirColunas();
  }

  ExibirColunas(): string[] {
    return ['codigo', 'status', 'fornecedorNome', 'observacao', 'valorTotal', 'data', 'acoes'];
  }

  AbrirDialogExclusao(pedidoId: number): void {
    this.dialog.open(DialogExclusaoPedidoComponent, {
      data: {
        pedidoId: pedidoId
      }
    }).afterClosed().subscribe(resultado => {
      debugger;
      console.log('=================================>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + resultado);
      if (resultado === true) {
        setTimeout(() => {
          this.pedidoCompraService.RetornarPedidosLista().subscribe(resposta => {
            console.log('retorno =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            console.log(resposta);
            debugger;
            this.pedidoCompraList.data = resposta.data;
          });

        }, 2000);
      }
    });
  }

}

@Component({
  selector: 'app-dialog-exclusao-pedido',
  templateUrl: './dialog-exclusao-pedido.html'
})
export class DialogExclusaoPedidoComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public dados: any,
    private pedicoCompraService: PedidoCompraService,
    private snackBar: MatSnackBar) {

  }

  ExcluirPedido(pedidoId: number): void {
    this.pedicoCompraService.ExcluirPedidoCompra(pedidoId).subscribe(resposta => {
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
