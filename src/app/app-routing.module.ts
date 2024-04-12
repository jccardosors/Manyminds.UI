import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutenticacaoComponent } from './components/autenticacao/autenticacao.component';
import { HomeComponent } from './components/home/home.component';
import { ProdutoListaComponent } from './components/produto/produto-lista.component';
import { RegistroLogsListaComponent } from './components/registroLogs/registro-logs-lista.component';
import { PedidoCompraListaComponent } from './components/pedidoCompra/pedido-compra-lista.component';
import { UsuarioListaComponent } from './components/usuario/usuario-lista.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuarioEdicaoComponent } from './components/usuario/usuario-edicao.component';
import { ProdutoComponent } from './components/produto/produto.component';
import { ProdutoEdicaoComponent } from './components/produto/produto-edicao.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
  children: [
    // {
    //   path: 'home', component: HomeComponent
    // },
    {
      path: 'usuario-lista', component: UsuarioListaComponent
    },
    {
      path: 'produto-lista', component: ProdutoListaComponent
    },
    {
      path: 'produto-novo', component: ProdutoComponent
    },
    {
      path: 'produto-edicao/:codigo', component: ProdutoEdicaoComponent
    },
    {
      path: 'pedidocompra-lista', component: PedidoCompraListaComponent
    },
    {
      path: 'logs-lista', component: RegistroLogsListaComponent
    },
    {
      path: 'usuario-edicao/:codigo', component: UsuarioEdicaoComponent
    }
  ]
},
{
  path: 'login', component: AutenticacaoComponent
},
{
  path: 'usuario-novo', component: UsuarioComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

