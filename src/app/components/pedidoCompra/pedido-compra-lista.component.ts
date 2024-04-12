import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PedidoCompra } from '../../models/PedidoCompra';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PedidoCompraService } from '../../services/pedido-compra.service';
import { MatDialog } from '@angular/material/dialog';

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
    return ['codigo', 'status', 'fornecedorCodigo', 'observacao', 'valorTotal', 'data', 'acoes'];
  }

}
