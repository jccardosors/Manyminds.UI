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

@Component({
  selector: 'app-pedido-compra',
  templateUrl: './pedido-compra.component.html',
  styleUrl: './pedido-compra.component.css'
})
export class PedidoCompraComponent implements OnInit, OnChanges {
  formulario: any;
  fornecedorList: Fornecedor[] | [];
  errors: string[] = [];
  displayColumns: string[] | undefined;
  itensList = new MatTableDataSource<PedidoCompraItem>();
  reAbrirModal: boolean | false; 
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private fornecedorService: FornecedorService, private pedidoCompra: PedidoCompraService, private router: Router,
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
    let date: Date = new Date();

    this.fornecedorService.RetornarTodosFornecedores().subscribe(response => {
      this.fornecedorList = response.data;
    });

    this.itensList = new MatTableDataSource<PedidoCompraItem>(this.pedidoCompraItemService.getData());
    this.itensList.paginator = this.paginator;    

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

      this.itensList.paginator = this.paginator;
      this.itensList._updateChangeSubscription();
      this.changeDetectorRefs.detectChanges();
      this.ngOnChanges(null);
    });
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
  produto_List: Produto[] | [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialogRef: MatDialogRef<DialogAdicionarItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PedidoCompraItem, private produtoService: ProdutoService,
    private dataService: PedidoCompraItemService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.produtoService.RetornarTodosProdutos().subscribe(response => {
      this.produto_List = response.data;
      console.log(this.produto_List);
    });
  }

  onSubmit(formData) {
    let id = this.dataService.getData().length + 1;
    formData.id = id;
    this.dataService.addData(formData);
    this.dialogRef.close(1);
  }

  onYesClick(): void {
    this.dialogRef.close(0);
  }

  getDados(): PedidoCompraItem[] {
    return this.dataService.getData();
  }
}
