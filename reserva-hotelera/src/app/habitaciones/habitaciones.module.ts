import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HabitacionesPageRoutingModule } from './habitaciones-routing.module';

import { HabitacionesPage } from './habitaciones.page';

import { SharedModule } from '../shared/chared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    HabitacionesPageRoutingModule
  ],
  declarations: [HabitacionesPage]
})
export class HabitacionesPageModule {}
