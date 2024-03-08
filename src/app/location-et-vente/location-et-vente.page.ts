import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { register } from 'swiper/element/bundle';
register();
import Swiper from 'swiper';

@Component({
  selector: 'app-location-et-vente',
  templateUrl: './location-et-vente.page.html',
  styleUrls: ['./location-et-vente.page.scss'],
})
export class LocationEtVentePage implements OnInit {
  showContent: boolean = true;
  showAchatContent: boolean = true; 
  images: string[] = [];
  mySwiper!: Swiper;
  selectedImages: string[] = [];
  public selectedSegment: string = 'Acheter un véhicule';
  @ViewChild('slides', { static: true }) slides: any;
  userEmail: string | null = null;
  marque!: string;
  modele!: string;
  prix!: string;
  boite!: string;
  carburant!: string;
  kilometrage!: string;
  annee!: string;
  marqueLoc!: string;
  modeleLoc!: string;
  prixjour!: string;
  boiteLoc!: string;
  carburantLoc!: string;

  constructor(private firestore: AngularFirestore,private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      // Mettre à jour l'adresse e-mail de l'utilisateur
      this.userEmail = user ? user.email : null;
    });
  }

  VoitureLocation(): void {
    const VoitureLocation = {
      marqueLoc: this.marqueLoc,
      modeleLoc: this.modeleLoc,
      prixjour: this.prixjour,
      boiteLoc: this.boiteLoc,
      carburantLoc: this.carburantLoc
    }
    this.firestore.collection('carsloc').add(VoitureLocation)
    .then(() => {
      console.log('Voiture à acheter ajoutée avec succès à Firestore');
      this.reinitialiserChamps();
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout de la voiture à acheter : ', error);
    });
  }

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

    this.firestore.collection('cars').add(voitureAchat)
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
    this.marqueLoc = '';
    this.modeleLoc = '';
    this.boiteLoc = '';
    this.carburantLoc = '';
    this.prixjour = '';
  }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }
  segmentChanged(event: any) {
    // Détruire le Swiper existant avant de changer de segment
    if (this.mySwiper) {
      this.mySwiper.destroy();
    }

  // Réinitialiser le Swiper après avoir changé de segment
    setTimeout(() => {
      this.initSwiper();
    });

    this.selectedSegment = event.detail.value;
    
    // Contrôler l'affichage des parties en fonction du segment sélectionné
    if (this.selectedSegment === 'Acheter un véhicule') {
        this.showContent = true;
        this.showAchatContent = true;
    } else if (this.selectedSegment === 'Louer un véhicule') {
        this.showContent = true;
        this.showAchatContent = false;
    } else {
        this.showContent = false;
    }

    console.log('Segment changed to', this.selectedSegment);
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

  ngOnInit() {}

  ngAfterViewInit() {
    this.initSwiper();
  }

}
