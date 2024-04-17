import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Fornecedor } from '../../models/Fornecedor';
import { FornecedorService } from '../../services/fornecedor.service';
import { PedidoCompraService } from '../../services/pedido-compra.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PedidoCompraItem } from '../../models/PedidoCompraItem';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Produto } from '../../models/Produto';
import { ProdutoService } from '../../services/produto.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PedidoCompraItemService } from '../../services/pedido-compra-item.service';
import {NgForm} from '@angular/forms';
//let itensPedidoList = new MatTableDataSource<PedidoCompraItem>();

@Component({
  selector: 'app-pedido-compra',
  templateUrl: './pedido-compra.component.html',
  styleUrl: './pedido-compra.component.css'
})
export class PedidoCompraComponent implements OnInit {
  formulario: any;
  fornecedorList: Fornecedor[] | [];
  errors: string[] = [];
  displayColumns: string[] | undefined;
  itensList = new MatTableDataSource<PedidoCompraItem>();

  // @ViewChild(MatTable, { static: true }) tableTesteList: MatTable<PedidoCompraItem>;

  // @ViewChild(MatPaginator, { static: true })
  // paginator: MatPaginator | undefined;

  // @ViewChild(MatSort, { static: false })
  // sort: MatSort | undefined
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private fornecedorService: FornecedorService, private pedidoCompra: PedidoCompraService, private router: Router,
    private snackBar: MatSnackBar, private dialog: MatDialog, 
    private datadialogRef: MatDialogRef<DialogAdicionarItemComponent>,
     private pedidoCompraItemService: PedidoCompraItemService) { }

  ngOnInit(): void {
    this.errors = [];
    this.fornecedorService.RetornarTodosFornecedores().subscribe(response => {
      this.fornecedorList = response.data;

      // this.itensList.data = [];
      // this.itensList.sort = this.sort;


    });

    this.itensList = new MatTableDataSource<PedidoCompraItem>(this.pedidoCompraItemService.getData());   
    this.itensList.paginator = this.paginator;

    let date: Date = new Date();

    this.formulario = new FormGroup({
      data: new FormControl(date.toLocaleDateString(), [Validators.required]),
      observacao: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
      fornecedorCodigo: new FormControl(null, [Validators.required]),
      status: new FormControl(0, [Validators.required]),
      valorTotal: new FormControl(0, [Validators.required]),
    });

    this.displayColumns = this.ExibirColunas();
  }

  ExibirColunas(): string[] {
    return ['codigo', 'produtoCodigo', 'quantidade', 'acoes'];
  }


  EnviarFormulario(): void {
    this.errors = [];
    let pedido = this.formulario.value;

    this.pedidoCompra.AdicionarPedidoCompra(pedido).subscribe(response => {

      this.router.navigate(['/pedidocompra-lista']);

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
    this.router.navigate(['/pedidocompra-lista']);
  }

  AbrirDialogAddItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      right: '0'
    };
    dialogConfig.width = '60%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dataRef = this.dialog.open(DialogAdicionarItemComponent, dialogConfig);
    dataRef.afterClosed().subscribe(result => {
      this.itensList.paginator = this.paginator;
    });

    // let itemModalDialog = this.dialog.open(DialogAdicionarItemComponent, {});

    // itemModalDialog.beforeClosed().subscribe(resultado => {
    //   this.tableTesteList.dataSource = itensPedidoList.data;
    //     this.itensList = new MatTableDataSource<PedidoCompraItem>(itensPedidoList.data);
    //     this.itensList._updateChangeSubscription();
    //    // this.itensList.data = itensPedidoList.data
    //     this.itensList.sort = this.sort;
    //     this.itensList.paginator = this.paginator;
    //     this.itensList._updateChangeSubscription();
    // this.itensList.connect().next(itensPedidoList.data);
    // this.paginator._changePageSize(this.paginator.pageSize);
    // let clone1 = itensPedidoList.data.slice();
    // this.itensList.data = clone1;
    // this.itensList.data = itensPedidoList.data;
    // this.itensList.connect().next(itensPedidoList.data);
    // this.itensList.data.filter(a => a);
    // this.changeDetectorRefs.detectChanges();
    // console.log(this.itensList.data);
    // console.log(itensPedidoList.data);

    // this.changeDetectorRefs.detectChanges();
    //    this.tableTesteList.renderRows();
    // });

    // itemModalDialog.afterClosed().subscribe(resultado => {
    //   this.tableTesteList.dataSource = itensPedidoList.data;
    //     this.itensList = new MatTableDataSource<PedidoCompraItem>(itensPedidoList.data);
    //     this.itensList._updateChangeSubscription();
    //     // this.itensList.data = itensPedidoList.data;
    //     this.itensList.sort = this.sort;
    //     this.itensList.paginator = this.paginator;
    //     this.itensList._updateChangeSubscription();
    // this.itensList.connect().next(itensPedidoList.data);
    // this.paginator._changePageSize(this.paginator.pageSize);
    // let clone1 = itensPedidoList.data.slice();
    // this.itensList.data = clone1;
    //this.itensList.data = itensPedidoList.data;
    // this.itensList.connect().next(itensPedidoList.data);
    //  this.itensList.data.filter(a => a);
    //  this.changeDetectorRefs.detectChanges();
    //  this.itensList.data.filter(a => a);
    // console.log(this.itensList.data);
    // console.log(itensPedidoList.data);
    //  this.itensList.sortData.apply.bind;
    //     this.changeDetectorRefs.detectChanges();
    //     this.tableTesteList.renderRows();
    // });

    // this.itensList.data.filter(a => a);
    // this.changeDetectorRefs.detectChanges();
    // this.itensList.data.filter(a => a);
  }

  onNoClick(): void {
    this.datadialogRef.close();
  }
}

@Component({
  selector: 'app-dialog-adicionar-item',
  templateUrl: './dialog-adicionar-item.html'
})
export class DialogAdicionarItemComponent implements OnInit {

  dataSource = new MatTableDataSource<PedidoCompraItem>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // formularioItem: any;
  produto_List: Produto[] | [];
  // errors: string[] = [];

  constructor(public dialogRef: MatDialogRef<DialogAdicionarItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PedidoCompraItem, private produtoService: ProdutoService,
     private dataService: PedidoCompraItemService) { }

 
  ngOnInit(): void {
    //this.errors = [];
    this.produtoService.RetornarTodosProdutos().subscribe(response => {
      this.produto_List = response.data;
      console.log(this.produto_List);
    });

    // setTimeout(() => {
    // this.formularioItem = new FormGroup({
    //   codigo: new FormControl(0, [Validators.required]),
    //   pedidoCompraCodigo: new FormControl(0, [Validators.required, Validators.maxLength(150)]),
    //   produtoCodigo: new FormControl(0, [Validators.required]),
    //   quantidade: new FormControl(0, [Validators.required]),
    //   valor: new FormControl(0, [Validators.required]),
    // });
    // }, 3000);
  }

  onSubmit(formData) {
     let id = this.dataService.getData().length + 1;
     formData.id = id;
    this.dataService.addData(formData);
    this.dialogRef.close(false);
  }

  // EnviarFormularioItem(): void {
  //   let pedidoItem = this.formularioItem.value;
  //   itensPedidoList.data.push(pedidoItem);
  //   this.formularioItem.reset();



  // }

  // get propriedadeItens() {
  //   return this.formularioItem.controls;
  // }

  onYesClick(): void {
    this.dialogRef.close(false);
  }


}
