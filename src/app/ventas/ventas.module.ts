import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VentasPageRoutingModule } from './ventas-routing.module';

import { VentasPage } from './ventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VentasPageRoutingModule
  ],
  declarations: [VentasPage]
})
export class VentasPageModule {}
