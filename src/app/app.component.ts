import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  connected?: boolean;
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private menu: MenuController
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('non connecté');
        this.connected = false;              
      } else {
        console.log('connecté: ' + auth.uid);
        this.connected = true;
      }
    })
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.router.navigateByUrl('screen');
    });
  }
  logout() {
    if (this.connected) {
      this.afAuth.signOut().then(() => {
        // Rediriger vers la page de connexion une fois que l'utilisateur est déconnecté
        this.router.navigateByUrl('/connexion');
        this.menu.close();
      }).catch(error => {
        // Gérer les erreurs éventuelles ici
        console.error('Erreur lors de la déconnexion :', error);
      });
    }
  }
  retour() {
    if (!this.connected) {
      this.menu.close();
      this.router.navigateByUrl('connexion');
    }
  }
}
