import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TargetsPage } from './targets.page';

const routes: Routes = [
  {
    path: '',
    component: TargetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TargetsPageRoutingModule {}
