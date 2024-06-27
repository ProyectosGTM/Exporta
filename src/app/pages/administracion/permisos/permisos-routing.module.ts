import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPermisosComponent } from './lista-permisos/lista-permisos.component';
import { AltaPermisosComponent } from './alta-permisos/alta-permisos.component';

const routes: Routes = [
  { path: 'lista-permisos',component:ListaPermisosComponent},
  { path: 'alta-permiso', component: AltaPermisosComponent, data: { title: 'Alta Permiso', breadcrumb: 'Alta Permiso'}},
  { path: 'editar-permiso/:idPermiso', component: AltaPermisosComponent, data: { title: 'Editar Permiso', breadcrumb: 'Editar Permiso'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermisosRoutingModule { }
