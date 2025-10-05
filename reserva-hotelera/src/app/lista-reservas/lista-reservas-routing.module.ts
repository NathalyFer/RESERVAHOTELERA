import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaReservasPage } from './lista-reservas.page';

const routes: Routes = [{ path: '', component: ListaReservasPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaReservasPageRoutingModule {}
