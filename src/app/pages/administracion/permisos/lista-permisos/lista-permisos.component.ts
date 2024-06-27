import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-permisos',
  templateUrl: './lista-permisos.component.html',
  styleUrl: './lista-permisos.component.scss'
})
export class ListaPermisosComponent implements OnInit {
  pageSizeOptions = [10, 50, 100, 200];

  public loading: boolean = false;
  public loadingMessage: string = 'Cargando...';
  public mensajeAgrupar: string = "Arrastre un encabezado de columna aquí para agrupar por esa columna";
  public listaPermisos: any[];
	public showFilterRow: boolean;
	public showHeaderFilter: boolean;

  constructor(){
    this.showFilterRow = true;
    this.showHeaderFilter = true;
  }
  
  ngOnInit(): void {
      
  }
}
