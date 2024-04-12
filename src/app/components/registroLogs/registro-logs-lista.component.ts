import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistroLogs } from '../../models/RegistroLogs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RegistroLogsService } from '../../services/registro-logs.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-logs-lista',
  templateUrl: './registro-logs-lista.component.html',
  styleUrl: './registro-logs-lista.component.css'
})
export class RegistroLogsListaComponent  implements OnInit {

  logsList = new MatTableDataSource<RegistroLogs>();
  displayColumns: string[] | undefined;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator | undefined;

  @ViewChild(MatSort, { static: false })
  sort: MatSort | undefined

  constructor(private registroLogsService: RegistroLogsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.registroLogsService.RetornarTodosLogs().subscribe(resultado => {
      console.log(resultado);
      var resultadoList: RegistroLogs[] = [];

      resultadoList = resultado.data;
      console.log(resultadoList);
      this.logsList.data = resultadoList;

      debugger;
      this.logsList.sort = this.sort;

      this.logsList.paginator = this.paginator;
    });

    this.displayColumns = this.ExibirColunas();
  }

  ExibirColunas(): string[] {
    return ['codigo', 'usuarioCodigo', 'descricao', 'data'];
  }

}
