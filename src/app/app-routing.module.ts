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
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
