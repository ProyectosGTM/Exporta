import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulosRoutingModule } from './modulos-routing.module';
import { ListaModulosComponent } from './lista-modulos/lista-modulos.component';
import { AgregarModulosComponent } from './agregar-modulos/agregar-modulos.component';
import { DxLoadPanelModule } from 'devextreme-angular';


@NgModule({
  declarations: [
    ListaModulosComponent,
    AgregarModulosComponent
  ],
  imports: [
    CommonModule,
    ModulosRoutingModule,
    DxLoadPanelModule
  ]
})
export class ModulosModule { }
