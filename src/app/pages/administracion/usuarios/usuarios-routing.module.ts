import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { AltaUsuarioComponent } from './alta-usuario/alta-usuario.component';

const routes: Routes = [
  { path: 'lista-usuarios',component:ListaUsuariosComponent},
  { path: 'alta-usuario', component: AltaUsuarioComponent, data: { title: 'Alta Usuario', breadcrumb: 'Alta Usuario'}},
  { path: 'editar-usuario/:idUsuario', component: AltaUsuarioComponent, data: { title: 'Editar Usuario', breadcrumb: 'Editar Usuario'}},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
