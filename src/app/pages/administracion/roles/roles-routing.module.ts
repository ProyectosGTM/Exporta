import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaRolesComponent } from './lista-roles/lista-roles.component';
import { AltaRolesComponent } from './alta-roles/alta-roles.component';

const routes: Routes = [
  { path: 'lista-roles',component:ListaRolesComponent},
  { path: 'alta-roles', component: AltaRolesComponent, data: { title: 'Alta Roles', breadcrumb: 'Alta Roles'}},
  { path: 'editar-roles/:idRol', component: AltaRolesComponent, data: { title: 'Editar Roles', breadcrumb: 'Editar Roles'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
