import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

//serviços
import { AutenticacaoService } from './services/autenticacao.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiConfigService } from './services/api-config.service';
import { UsuarioService } from './services/usuario.service';
import { ProdutoService } from './services/produto.service';
import { UtilsService } from './services/utils.service';
import { RegistroLogsService } from './services/registro-logs.service';
import { PedidoCompraService } from './services/pedido-compra.service';

//components
import { AutenticacaoComponent } from './components/autenticacao/autenticacao.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ProdutoComponent } from './components/produto/produto.component';
import { HomeComponent } from './components/home/home.component';
import { CabecalhoComponent } from './components/cabecalho/cabecalho.component';
import { DialogExclusaoProdutoComponent, ProdutoListaComponent } from './components/produto/produto-lista.component';
import { DialogExclusaoPedidoComponent, PedidoCompraListaComponent } from './components/pedidoCompra/pedido-compra-lista.component';
import { RegistroLogsListaComponent } from './components/registroLogs/registro-logs-lista.component';
import { UsuarioListaComponent } from './components/usuario/usuario-lista.component';
import { UsuarioEdicaoComponent } from './components/usuario/usuario-edicao.component';
import { ProdutoEdicaoComponent } from './components/produto/produto-edicao.component';
import { PedidoCompraEdicaoComponent } from './components/pedidoCompra/pedido-compra-edicao.component';
import { DialogAdicionarItemComponent, PedidoCompraComponent } from './components/pedidoCompra/pedido-compra.component';

//material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FlexLayoutModule } from '@angular/flex-layout';
import { PedidoCompraItemService } from './services/pedido-compra-item.service';
import { NgFor } from '@angular/common';



@NgModule({
  declarations: [ 
    AppComponent,
    AutenticacaoComponent,
    UsuarioComponent,
    HomeComponent,
    CabecalhoComponent,
    ProdutoListaComponent,
    UsuarioListaComponent,
    PedidoCompraListaComponent,
    RegistroLogsListaComponent,
    UsuarioEdicaoComponent,
    ProdutoComponent,
    ProdutoEdicaoComponent,
    DialogExclusaoProdutoComponent,
    DialogExclusaoPedidoComponent,
    PedidoCompraEdicaoComponent,
    PedidoCompraComponent,
    DialogAdicionarItemComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, FormsModule, ReactiveFormsModule, MatTableModule, MatIconModule, MatButtonModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatDividerModule, MatSelectModule, MatGridListModule, MatDialogModule,
    MatAutocompleteModule, MatPaginatorModule, MatSortModule, MatSnackBarModule, MatProgressBarModule, MatSidenavModule, 
    MatListModule, MatToolbarModule,
    FlexLayoutModule
  ],
  providers: [AutenticacaoService, ApiConfigService, UsuarioService, ProdutoService, UtilsService, RegistroLogsService, 
    PedidoCompraService, PedidoCompraItemService, 
    DialogExclusaoProdutoComponent, DialogExclusaoPedidoComponent, DialogAdicionarItemComponent,
     provideClientHydration(), provideAnimationsAsync(),    
     { provide: MatDialogRef, useValue: {} },
     { provide: MAT_DIALOG_DATA, useValue: {}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
