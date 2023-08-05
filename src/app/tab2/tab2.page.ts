import { Component } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  Marker,
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  map: any = null;

  constructor(
    private googleMaps: GoogleMaps
    ) {
    this.map = null;
  }

  async loadMap() {
    // Créez une instance de GoogleMap avec des options
    this.map = this.googleMaps.create('map_canvas');
  
    // Attendez que la carte soit prête
    await this.map.one(GoogleMapsEvent.MAP_READY);
  
    // Récupérez la position de l'utilisateur (à partir d'une source réelle ou fictive)
    const userLocation: LatLng = new LatLng(37.7749, -122.4194); // Remplacez cela par la vraie position de l'utilisateur
  
    // Ajoutez un marqueur à la position de l'utilisateur
    this.map.addMarker({
      position: userLocation,
      title: 'Votre position',
    });
  
    // Déplacez la carte pour centrer la position de l'utilisateur
    this.map.animateCamera({
      target: userLocation,
      zoom: 15,
    });
  }
  

  ngOnInit() {
    this.loadMap();
  }

}
