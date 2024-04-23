import { ChangeDetectorRef, Component, Inject, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
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
import { NgForm } from '@angular/forms';
import { throttleTime } from 'rxjs';
import { PedidoCompraRequest } from '../../models/Request/PedidoCompraRequest';
import { PedidoCompra } from '../../models/PedidoCompra';

@Component({
  selector: 'app-pedido-compra',
  templateUrl: './pedido-compra.component.html',
  styleUrl: './pedido-compra.component.css'
})
export class PedidoCompraComponent implements OnInit, OnChanges {
  formulario: any;
  pedidoCompra: PedidoCompra = new PedidoCompra();
  fornecedorList: Fornecedor[] | [];
  errors: string[] = [];
  displayColumns: string[] | undefined;
  itensList = new MatTableDataSource<PedidoCompraItem>();
  reAbrirModal: boolean | false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private fornecedorService: FornecedorService, private pedidoCompraService: PedidoCompraService, private router: Router,
    private snackBar: MatSnackBar, private dialog: MatDialog,
    public datadialogRef: MatDialogRef<DialogAdicionarItemComponent>,
    private pedidoCompraItemService: PedidoCompraItemService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('passou no onchanges', this.itensList);
    if (this.reAbrirModal) {
      this.AbrirDialogAddItem();
    }
  }

  ngOnInit(): void {
    this.errors = [];
    let dateNow: Date = new Date();
    this.pedidoCompra.data = dateNow;
    this.pedidoCompra.status = 0;
    this.pedidoCompra.valorTotal = 0;

    this.fornecedorService.RetornarTodosFornecedores().subscribe(response => {
      this.fornecedorList = response.data;
    });

    // if (this.reAbrirModal) {
    this.itensList = new MatTableDataSource<PedidoCompraItem>(this.pedidoCompraItemService.getData());
    // } else {
    //   this.itensList = new MatTableDataSource<PedidoCompraItem>();
    // }

    this.itensList.paginator = this.paginator;

    // this.formulario = new FormGroup({
    //   data: new FormControl(date.toLocaleDateString(), [Validators.required]),
    //   observacao: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
    //   fornecedorCodigo: new FormControl(null, [Validators.required]),
    //   status: new FormControl(0, [Validators.required]),
    //   valorTotal: new FormControl(0, [Validators.required]),
    // });

    this.displayColumns = this.ExibirColunas();
  }

  ExibirColunas(): string[] {
    return ['codigo', 'produtoCodigo', 'nomeProduto', 'quantidade', 'valorProduto', 'acoes'];
  }


  EnviarFormulario(): void {
    this.errors = [];
    if (this.itensList.data.length > 0) {
      //let pedido = this.formulario.value;
      let dateNow = new Date();
      let pedidoCompraRequest: PedidoCompraRequest = new PedidoCompraRequest();

      this.pedidoCompra.data = dateNow;
      this.pedidoCompra.fornecedorNome = '';
      pedidoCompraRequest.Pedido = this.pedidoCompra;

      this.itensList.data.forEach(element => {
        element.codigo = 0;
      });

      pedidoCompraRequest.items = this.itensList.data;

      this.pedidoCompraService.AdicionarPedidoCompra(pedidoCompraRequest).subscribe(response => {

        this.pedidoCompraItemService.deleteData();

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
    } else {
      this.snackBar.open('O pedido deve conter pelo menos 1 item!', null, {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }

  }

  // get propriedade() {
  //   return this.formulario.controls;
  // }

  VoltarListagem(): void {
    this.router.navigate(['/pedidocompra-lista']);
  }

  AbrirDialogAddItem() {
    this.reAbrirModal = false;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '60%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dataRef = this.dialog.open(DialogAdicionarItemComponent, dialogConfig);

    dataRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.reAbrirModal = true;
      } else {
        this.reAbrirModal = false;
      }

      this.calcularValorTotal();
      let xx = this.itensList.data.sort((a, b) => a.codigo < b.codigo ? 1 : -1);
      this.itensList.data = xx;
      this.itensList.paginator = this.paginator;
      this.itensList._updateChangeSubscription();
      this.changeDetectorRefs.detectChanges();
      this.ngOnChanges(null);
    });
  }

  AbrirDialogEditItem(pedidoCompraItem: PedidoCompraItem) {
    this.reAbrirModal = false;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '60%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dataRef = this.dialog.open(DialogAdicionarItemComponent, {
      data: pedidoCompraItem
    });

    dataRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.reAbrirModal = true;
      } else {
        this.reAbrirModal = false;
      }

      this.calcularValorTotal();
      let xx = this.itensList.data.sort((a, b) => a.codigo < b.codigo ? 1 : -1);
      this.itensList.data = xx;
      this.itensList.paginator = this.paginator;
      this.itensList._updateChangeSubscription();
      this.changeDetectorRefs.detectChanges();
      this.ngOnChanges(null);
    });
  }

  onNoClick(): void {
    this.datadialogRef.close();
  }

  AbrirDialogDeleteItem(itemId: number): any {
    this.dialog.open(DialogExcluirPedidoCompraItemComponent, {
      data: {
        itemId: itemId
      }
    }).afterClosed().subscribe(resultado => {
      debugger;
      console.log('=================================>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + resultado);
      if (resultado === true) {
        let xx = this.itensList.data.sort((a, b) => a.codigo < b.codigo ? 1 : -1);
        this.itensList.data = xx;
        this.itensList.paginator = this.paginator;
        this.itensList._updateChangeSubscription();
        this.changeDetectorRefs.detectChanges();
        this.ngOnChanges(null);

      }
    });
  }

  calcularValorTotal() {
    let total: number = 0;
    this.pedidoCompra.valorTotal = 0;
    debugger;
    this.itensList.data.forEach(p => {
      total = total + (p.quantidade * p.valorProduto);
    });
    this.pedidoCompra.valorTotal = total;
  }
}

@Component({
  selector: 'app-dialog-adicionar-item',
  templateUrl: './dialog-adicionar-item.html',
  styleUrl: './pedido-compra.component.css'
})
export class DialogAdicionarItemComponent implements OnInit {

  dataSource = new MatTableDataSource<PedidoCompraItem>();
  produto_List: Produto[] | [];
  produto_Codigo: number | 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pedidoCompraItem: PedidoCompraItem = new PedidoCompraItem();

  constructor(public dialogRef: MatDialogRef<DialogAdicionarItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PedidoCompraItem, private produtoService: ProdutoService,
    private dataService: PedidoCompraItemService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.produtoService.RetornarTodosProdutos().subscribe(response => {
      this.produto_List = response.data;
      console.log(this.produto_List);
    });

    console.log('dados ==========================================> ', this.data);
    if (this.data === null) {
      if (this.getDados().length > 0) {
        let orderedList = this.getDados().sort((a, b) => a.codigo < b.codigo ? 1 : -1);
        this.pedidoCompraItem.codigo = orderedList[0].codigo + 1;

      } else {
        this.pedidoCompraItem.codigo = 1;
      }
      this.pedidoCompraItem.pedidoCompraCodigo = 1;
      this.pedidoCompraItem.valorProduto = 0;
      this.pedidoCompraItem.quantidade = 0
    } else {
      this.pedidoCompraItem = this.data;
    }
  }

  // onSubmit(formData) {
  // let id = this.dataService.getData().length + 1;
  // formData.id = id;

  // let resultado = this.produto_List.find(p => (p as Produto).codigo === formData.produtoCodigo);
  // formData.nomeProduto = resultado.nome;

  // if (this.data === null) {
  //   this.dataService.addData(formData);
  //   this.dialogRef.close(1);
  // } else {
  //   let index = this.dataService.getData().findIndex(p => p.codigo === formData.codigo);
  //   this.dataService.getData().splice(index, 1);
  //   this.dataService.addData(formData);
  //   this.dialogRef.close(0);
  // }

  // }

  onYesClick(): void {
    this.dialogRef.close(0);
  }

  getDados(): PedidoCompraItem[] {
    return this.dataService.getData();
  }

  onMostrarValor($event: any) {
    let resultado = this.produto_List.find(p => (p as Produto).codigo === this.pedidoCompraItem.produtoCodigo);
    this.pedidoCompraItem.valorProduto = resultado.valor;
    this.pedidoCompraItem.nomeProduto = resultado.nome;
  }

  cadastrar() {
    let id = this.dataService.getData().length + 1;
    //formData.id = id;
    // let codigo = this.pedidoCompraItem.produtoCodigo;
    //     let resultado = this.produto_List.find(p => (p as Produto).codigo == =this.pedidoCompraItem.produtoCodigo);
    //     this.pedidoCompraItem.nomeProduto = resultado.nome;
    if (this.data === null) {
      this.dataService.addData(this.pedidoCompraItem);
      this.dialogRef.close(1);
    } else {
      let index = this.dataService.getData().findIndex(p => p.codigo === this.pedidoCompraItem.codigo);
      this.dataService.getData().splice(index, 1);
      this.dataService.addData(this.pedidoCompraItem);
      this.dialogRef.close(0);
    }
  }
}

@Component({
  selector: 'app-dialog-exclusao-item',
  templateUrl: './dialog-exclusao-item.html'
})
export class DialogExcluirPedidoCompraItemComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public dados: any,
    private pedidoCompraItemService: PedidoCompraItemService,
    private snackBar: MatSnackBar) {

  }

  ExcluitItem(itemId: number): void {

    let index = this.pedidoCompraItemService.getData().findIndex(p => p.codigo === itemId);
    this.pedidoCompraItemService.getData().splice(index, 1);
    // this.produtoService.AtivarDesativarProduto(produtoId).subscribe(resposta => {
    //   debugger;
    //   console.log(resposta);
    //   this.snackBar.open(resposta.message, null, {
    //     duration: 7000,
    //     horizontalPosition: 'right',
    //     verticalPosition: 'top'
    //   });
    // });

    // teste = "abc 123";
  }
}
