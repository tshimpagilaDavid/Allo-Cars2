import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {}

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }

}
