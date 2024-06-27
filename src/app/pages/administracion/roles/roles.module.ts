import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { ListaRolesComponent } from './lista-roles/lista-roles.component';
import { AltaRolesComponent } from './alta-roles/alta-roles.component';
import { DxLoadPanelModule } from 'devextreme-angular';


@NgModule({
  declarations: [
    ListaRolesComponent,
    AltaRolesComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    DxLoadPanelModule
  ]
})
export class RolesModule { }
