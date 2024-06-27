import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermisosRoutingModule } from './permisos-routing.module';
import { ListaPermisosComponent } from './lista-permisos/lista-permisos.component';
import { AltaPermisosComponent } from './alta-permisos/alta-permisos.component';
import { DxDataGridModule, DxLoadPanelModule } from 'devextreme-angular';


@NgModule({
  declarations: [
    ListaPermisosComponent,
    AltaPermisosComponent],
  imports: [
    CommonModule,
    PermisosRoutingModule,
    DxDataGridModule,
    DxLoadPanelModule,
  ]
})
export class PermisosModule { }
