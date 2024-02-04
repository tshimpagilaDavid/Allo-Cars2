import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-et-vente',
  templateUrl: './location-et-vente.page.html',
  styleUrls: ['./location-et-vente.page.scss'],
})
export class LocationEtVentePage implements OnInit {

  constructor() { }

  preloadImage() {
    const image = new Image();
    image.src = '/assets/VX.JPG';
  }

  ngOnInit() {
    this.preloadImage
  }

}
