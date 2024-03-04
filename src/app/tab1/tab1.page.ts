import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private router: Router,) {}

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }

  achat() {
    this.router.navigateByUrl('/tabs/location-et-vente');
  }

  location() {
    this.router.navigateByUrl('/tabs/location-et-vente');
  }

  taxi() {
    this.router.navigateByUrl('/tabs/tab2');
  }

}
