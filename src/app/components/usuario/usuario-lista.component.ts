import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from '../../models/Usuario';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsuarioService } from '../../services/usuario.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiConfigService } from '../../services/api-config.service';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrl: './usuario-lista.component.css'
})
export class UsuarioListaComponent implements OnInit {
  usuariosList = new MatTableDataSource<Usuario>();
  displayColumns: string[] | undefined;
  // opcoesCategorias: string[] = [];

   @ViewChild(MatPaginator, { static: true })
   paginator: MatPaginator | undefined;

   @ViewChild(MatSort, { static: false })
   sort: MatSort | undefined

  constructor(private usuarioService: UsuarioService, private apiConfigService: ApiConfigService) { }

  ngOnInit(): void {
    var codigo = 0;
    codigo = this.apiConfigService.ObterCodigoUsuario();
    this.usuarioService.RetornarUsuario(codigo).subscribe(resposta => {
      debugger;
      var resultadoList: any[] = [];
      resultadoList.push(resposta.data);     

      this.usuariosList.data = resultadoList;
      this.usuariosList.sort = this.sort;

       this.usuariosList.paginator = this.paginator;
    });

    this.displayColumns = this.ExibirColunas();
  }

  ExibirColunas(): string[] {
    return ['Codigo', 'Email','Senha', 'Acoes'];
  }
}
