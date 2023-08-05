import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationEtVentePage } from './location-et-vente.page';

const routes: Routes = [
  {
    path: '',
    component: LocationEtVentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationEtVentePageRoutingModule {}
