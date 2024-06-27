import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { AltaUsuarioComponent } from './alta-usuario/alta-usuario.component';
import { DxLoadPanelModule } from 'devextreme-angular';


@NgModule({
  declarations: [ListaUsuariosComponent,
    AltaUsuarioComponent],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    DxLoadPanelModule
  ]
})
export class UsuariosModule { }
