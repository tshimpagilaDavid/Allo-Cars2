import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { PickerController } from '@ionic/angular';

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

  async openDatePicker() {
    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'start',
          options: this.getDateOptions(),
          selectedIndex: 0,
        },
        {
          name: 'end',
          options: this.getDateOptions(),
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
          handler: (value) => {
            this.selectedStartDate = new Date(value.start.value);
            this.selectedEndDate = new Date(value.end.value);
            this.calculateTotalDays();          
          },
        },
      ],
    });
    await picker.present();
  }

  getDateOptions(): { text: string; value: string }[] {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date (today);
      date.setDate(today.getDate() + i);
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
    this.TotalDays = Math.round(differenceInTime / millisecondsInDay) + 1;
  }

  ionViewWillEnter() {
    const backgroundImage = document.querySelector('.background-image');
    if (backgroundImage) {}
  }

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
