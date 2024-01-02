import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  CityJson = environment.CityJson;
  CityName: any = 'Libreville';
  CarJson = environment.CarJson;
  CarName: any = 'Toyota';

  constructor() { }

  CityNameChange(event: any) {
    this.CityName = event.detail.value,
    console.log(event.target.value)
  }

  CarNameChange(event: any) {
    this.CarName = event.detail.value,
    console.log(event.target.value)
  }

  ngOnInit() {
  }

}
