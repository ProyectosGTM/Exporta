import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { LoginComponent } from './account/auth/login/login.component';
import { DefaultComponent } from './pages/dashboards/default/default.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '',
    component: LayoutComponent,
    // children: [
    //     {
    //         path: 'dashboard',
    //         component: DefaultComponent
    //     }
    // ]    
}
];
