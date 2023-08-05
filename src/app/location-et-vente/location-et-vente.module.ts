import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationEtVentePageRoutingModule } from './location-et-vente-routing.module';

import { LocationEtVentePage } from './location-et-vente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationEtVentePageRoutingModule
  ],
  declarations: [LocationEtVentePage]
})
export class LocationEtVentePageModule {}
