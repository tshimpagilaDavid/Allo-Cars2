import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();
import Swiper from 'swiper';

@Component({
  selector: 'app-location-et-vente',
  templateUrl: './location-et-vente.page.html',
  styleUrls: ['./location-et-vente.page.scss'],
})
export class LocationEtVentePage implements OnInit {
  images: string[] = [];
  selectedImages: string[] = [];
  @ViewChild('slides', { static: true }) slides: any;
  public selectedSegment: string = 'Acheter un véhicule';
  userEmail: string | null = null;
  marque!: string;
  modele!: string;
  prix!: string;
  boite!: string;
  carburant!: string;
  kilometrage!: string;
  annee!: string;

  constructor(private firestore: AngularFirestore) {}

  VoitureAchat(): void {
    const voitureAchat = {
      marque: this.marque,
      modele: this.modele,
      prix: this.prix,
      boite: this.boite,
      carburant: this.carburant,
      kilometrage: this.kilometrage,
      annee: this.annee
    };

    this.firestore.collection('voitures-achat').add(voitureAchat)
      .then(() => {
        console.log('Voiture à acheter ajoutée avec succès à Firestore');
        this.reinitialiserChamps();
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de la voiture à acheter : ', error);
      });
  }

  VoitureLocation(): void {
    const VoitureLocation = {
      marque: this.marque,
      modele: this.modele,
      prix: this.prix
    };

    this.firestore.collection('voitures_achat').add(VoitureLocation)
      .then(() => {
        console.log('Voiture à acheter ajoutée avec succès à Firestore');
        this.reinitialiserChamps();
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout de la voiture à acheter : ', error);
      });
  }

  reinitialiserChamps(): void {
    this.marque = '';
    this.modele = '';
    this.prix = '';
    this.boite = '';
    this.carburant = '';
    this.kilometrage = '';
    this.annee = '';
  }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.target.value,
    console.log(event.target.value)
  }
  selectImage(imageIndex: number) {
    const selectedImage = this.images[imageIndex]; // Accédez à la variable images à partir de l'instance de la classe avec 'this.'
    this.selectedImages.push(selectedImage);
  }
  initSwiper () {
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
        delay: 6000
      },
      slidesPerView: 1, // Une seule image visible à la fois
      spaceBetween: 100, // Pas d'espace entre les diapositives
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
      },
      on: {
        init: function() {
          // Retirer la classe 'hidden' des autres swipers
          const otherSwipers = document.querySelectorAll('.swiper-slide:not(.swiper-slide-active)');
          otherSwipers.forEach(slide => {
            slide.classList.remove('hidden');
          });
        }
      }
      // Ajoutez d'autres options ici
    });
  }

  ngOnInit() {
    this.initSwiper();
  }

}
