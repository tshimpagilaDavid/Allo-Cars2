import { Component, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swiper from 'swiper';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-location-et-vente',
  templateUrl: './location-et-vente.page.html',
  styleUrls: ['./location-et-vente.page.scss'],
})
export class LocationEtVentePage {
  showContent: boolean = true;
  showAchatContent: boolean = true;
  images: string[] = [];
  defaultImages: string[] = [
    'assets/gallery.jpg',
    'assets/gallery.jpg',
    'assets/gallery.jpg',
    'assets/gallery.jpg',
    'assets/gallery.jpg',
  ];
  mySwiper!: Swiper;
  selectedImages: (string | SafeResourceUrl)[] = [];
  voituresLocation: any[] = [];
  voituresAchat: any[] = [];
  public selectedSegment: string = 'Acheter un véhicule';
  @ViewChild('slides', { static: true }) slides: any;
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;
  userEmail: string | null = null;
  marque!: string;
  modele!: string;
  prix!: string;
  fournisseur!: string;
  boite!: string;
  carburant!: string;
  kilometrage!: string;
  annee!: string;
  marqueLoc!: string;
  modeleLoc!: string;
  prixjour!: string;
  boiteLoc!: string;
  carburantLoc!: string;
  fournisseurLoc!: string;

  constructor(private sanitizer: DomSanitizer, private firestore: AngularFirestore,private afAuth: AngularFireAuth,private storage: AngularFireStorage) {
    this.afAuth.authState.subscribe(user => {
      // Mettre à jour l'adresse e-mail de l'utilisateur
      this.userEmail = user ? user.email : null;
    });
  }

  async VoitureLocation(): Promise<void> {
    const VoitureLocation = {
      marqueLoc: this.marqueLoc,
      modeleLoc: this.modeleLoc,
      prixjour: this.prixjour,
      boiteLoc: this.boiteLoc,
      carburantLoc: this.carburantLoc,
      fournisseurLoc: this.fournisseurLoc,
      images: this.selectedImages.map(img => img.toString())
    }
    this.firestore.collection('carsLoc').add(VoitureLocation)
    .then(() => {
      console.log('Voiture à louer ajoutée avec succès à Firestore');
      this.reinitialiserChamps();
    })
    .catch(error => {
      console.error('Erreur lors de l\'ajout de la voiture à louer : ', error);
    });
  }

  async VoitureAchat(): Promise<void> {
    const voitureAchat = {
      marque: this.marque,
      modele: this.modele,
      prix: this.prix,
      boite: this.boite,
      carburant: this.carburant,
      kilometrage: this.kilometrage,
      annee: this.annee,
      fournisseur: this.fournisseur,
      images: this.selectedImages.map(img => img.toString())
    };

    try {
      await this.firestore.collection('cars').add(voitureAchat);
      console.log('Voiture à acheter ajoutée avec succès à Firestore');
      this.reinitialiserChamps();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la voiture à acheter : ', error);
    }
  }

  reinitialiserChamps(): void {
    this.marque = '';
    this.modele = '';
    this.prix = '';
    this.boite = '';
    this.carburant = '';
    this.kilometrage = '';
    this.annee = '';
    this.fournisseur = '';
    this.marqueLoc = '';
    this.modeleLoc = '';
    this.boiteLoc = '';
    this.carburantLoc = '';
    this.prixjour = '';
    this.fournisseurLoc = '';
    this.selectedImages = [];
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
    const selectedImage = this.selectedImages[imageIndex];
    this.selectedImages = [selectedImage];
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

  getVoituresAchat() {
    this.firestore.collection('cars').snapshotChanges().subscribe(data => {
      this.voituresAchat = data.map(e => {
        const data = e.payload.doc.data() as { [key: string]: any }; // Typage explicite en tant qu'objet
        return {
          id: e.payload.doc.id,
          ...data
        };
      });
    });
  }

  getVoituresLocation() {
    this.firestore.collection('carsLoc').snapshotChanges().subscribe(data => {
      this.voituresLocation = data.map(e => {
        const data = e.payload.doc.data() as { [key: string]: any }; // Typage explicite en tant qu'objet
        return {
          id: e.payload.doc.id,
          ...data
        };
      });
    });
  }

  isVideo(image: string | SafeResourceUrl): boolean {
    return typeof image === 'string' && image.includes('video');
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result?.toString();
      if (url) {
        this.selectedImages[index] = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(index: number): void {
    this.fileInputs.toArray()[index].nativeElement.click();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initSwiper();
    this.getVoituresAchat();
    this.getVoituresLocation();
  }

}
