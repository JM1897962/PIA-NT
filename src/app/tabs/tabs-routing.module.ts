import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:[
      
      {
        path:'inicio',
        loadChildren : () => import('../inicio/inicio.module').then(m=>m.InicioPageModule)
      },
      {
        path: 'galeria',
        loadChildren: () => import('../galeria/galeria.module').then(m=>m.GaleriaPageModule)
      },
      {
        path: 'targets',
        loadChildren: () => import('../targets/targets.module').then(m=>m.TargetsPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full'
  },

      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then(m=>m.LoginPageModule)
      }
      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}