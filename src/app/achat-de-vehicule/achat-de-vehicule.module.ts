import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AchatDeVehiculePageRoutingModule } from './achat-de-vehicule-routing.module';

import { AchatDeVehiculePage } from './achat-de-vehicule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AchatDeVehiculePageRoutingModule
  ],
  declarations: [AchatDeVehiculePage]
})
export class AchatDeVehiculePageModule {}
