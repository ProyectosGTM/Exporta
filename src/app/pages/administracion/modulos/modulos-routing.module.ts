import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaModulosComponent } from './lista-modulos/lista-modulos.component';
import { AgregarModulosComponent } from './agregar-modulos/agregar-modulos.component';

const routes: Routes = [
  { path: 'lista-modulos',component:ListaModulosComponent},
  { path: 'alta-modulo', component: AgregarModulosComponent, data: { title: 'Alta Módulo', breadcrumb: 'Alta Módulo'}},
  { path: 'editar-modulo/:idModulo', component: AgregarModulosComponent, data: { title: 'Editar Módulo', breadcrumb: 'Editar Módulo'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulosRoutingModule { }
