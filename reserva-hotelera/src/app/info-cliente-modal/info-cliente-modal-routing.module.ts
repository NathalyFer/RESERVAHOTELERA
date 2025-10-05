import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoClienteModalPage } from './info-cliente-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InfoClienteModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoClienteModalPageRoutingModule {}
