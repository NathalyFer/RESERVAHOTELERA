import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Habitaciones1PageRoutingModule } from './habitaciones1-routing.module';

import { Habitaciones1Page } from './habitaciones1.page';

import { SharedModule } from '../shared/chared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    Habitaciones1PageRoutingModule
  ],
  declarations: [Habitaciones1Page]
})
export class Habitaciones1PageModule {}
