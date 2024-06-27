import { Component } from '@angular/core';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, Marker, } from '@ionic-native/google-maps/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  lat: number = 0;
  lng: number = 0;
  zoom: number = 12;

  constructor() { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      }, error => {
        console.error('Error getting location', error);
      });
    } else {
      console.error('Geolocation not supported by this browser.');
    }
  }

}
