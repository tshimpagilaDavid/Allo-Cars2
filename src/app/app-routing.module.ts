import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'screen',
    loadChildren: () => import('./screen/screen.module').then( m => m.ScreenPageModule)
  },
  {
    path: 'connexion',
    loadChildren: () => import('./connexion/connexion.module').then( m => m.ConnexionPageModule)
  },
  {
    path: 'location-et-vente',
    loadChildren: () => import('./location-et-vente/location-et-vente.module').then( m => m.LocationEtVentePageModule)
  },
  {
    path: 'phone-number',
    loadChildren: () => import('./phone-number/phone-number.module').then( m => m.PhoneNumberPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'achat-de-vehicule',
    loadChildren: () => import('./achat-de-vehicule/achat-de-vehicule.module').then( m => m.AchatDeVehiculePageModule)
  },
  {
    path: '',
    redirectTo: 'screen',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
