import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Habitaciones1Page } from './habitaciones1.page';

const routes: Routes = [
  {
    path: '',
    component: Habitaciones1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Habitaciones1PageRoutingModule {}
