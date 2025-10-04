import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoClienteModalPageRoutingModule } from './info-cliente-modal-routing.module';

import { InfoClienteModalPage } from './info-cliente-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoClienteModalPageRoutingModule
  ],
  declarations: [InfoClienteModalPage]
})
export class InfoClienteModalPageModule {}
