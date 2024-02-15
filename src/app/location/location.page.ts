import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { PickerController } from '@ionic/angular';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();
import Swiper from 'swiper';

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
  selectedStartDate!: Date;
  selectedEndDate!: Date;
  TotalDays!: number;

  constructor(private pickerController: PickerController) { }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }

  async openDatePicker() {
    const today = new Date ();
    const tomorrow = new Date (today);
    tomorrow.setDate(today.getDate() + 1);
    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'start',
          options: this.getDateOptions(today),
          selectedIndex: 0,
        },
        {
          name: 'end',
          options: this.getDateOptions(undefined, today),
          selectedIndex: 0,
        }
      ],
      buttons: [
        {
          text: 'annuler',
          role: 'cancel',
        },
        {
          text: 'sélectionner',
          handler: (value: { start: { value: string | number | Date; }; end: { value: string | number | Date; }; }) => {
            this.selectedStartDate = new Date(value.start.value);
            this.selectedEndDate = new Date (value.end.value);
            this.calculateTotalDays();          
          },
        },
      ],
    });
    await picker.present();
  }

  getDateOptions(baseData: Date = new Date(), excludeDate?: Date): { text: string; value: string }[] {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date (today);
      date.setDate(today.getDate() + i);
      if (excludeDate && date.toDateString() === excludeDate.toDateString()) {
        continue;
      }
      options.push({ text: this.formatDate(date), value: date.toDateString() });
    }
    return options;
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric'};
    const formattedDate: string = new Intl.DateTimeFormat('fr-Fr', options).format(date)
    return formattedDate;
  }

  calculateTotalDays() {
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const startAtCurrentTime = new Date(this.selectedStartDate);
    startAtCurrentTime.setHours(currentDate.getHours(),currentDate.getMinutes(),currentDate.getSeconds(),0);
    const differenceInTime = this.selectedEndDate.getTime() - startAtCurrentTime.getTime();
    this.TotalDays = Math.round(differenceInTime / millisecondsInDay);
  }

  CityNameChange(event: any) {
    this.CityName = event.detail.value,
    console.log(event.target.value)
  }

  CarNameChange(event: any) {
    this.CarName = event.detail.value,
    console.log(event.target.value)
  }

  preloadImage() {
    const image = new Image();
    image.src = '/assets/demo2.JPG';
  }

  ngOnInit() {
    this.preloadImage;
    const mySwiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      loop: true,
      // Activer la navigation précédente et suivante
      pagination: { // Personnaliser la pagination
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      autoplay: {
        delay: 3500
      },
      slidesPerView: 1, // Une seule image visible à la fois
      spaceBetween: 0, // Pas d'espace entre les diapositives
      centeredSlides: true, // Centrer les diapositives
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 50, // Angle de rotation des diapositives
        stretch: 0, // Agrandissement des diapositives
        depth: 100, // Profondeur des diapositives
        modifier: 1, // Vitesse de défilement
        slideShadows: false, // Ombres des diapositives
      },
      navigation: {
        nextEl: '.swiper-button-next', // Sélecteur de la flèche suivante
        prevEl: '.swiper-button-prev', // Sélecteur de la flèche précédente
      }
      // Ajoutez d'autres options ici
    });
  }

}
