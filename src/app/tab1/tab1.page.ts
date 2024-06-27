import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

interface Post {
  imageUrl: string;
}


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userEmail: string | null = null;
  imageUrls: { [key: string]: string } = {};

  constructor(private router: Router,private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth) {}

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

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        this.loadImages();
      }
    });
  }

  async loadImages() {
    try {
      const postsSnapshot = await this.firestore.collection<Post>('post').get().toPromise();
      if (postsSnapshot) {
        postsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data && data.imageUrl) {
            this.imageUrls[doc.id] = data.imageUrl;
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des images', error);
    }
  }

  triggerFileInput(postId: string) {
    if (this.userEmail !== 'davidtshipangila@gmail.com') {
      console.error('Action non autorisée pour cet utilisateur');
      return;
    }
    const fileInput = document.getElementById(`fileInput-${postId}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  async onFileSelected(event: any, postId: string) {
    const file: File = event.target.files[0];
    if (file) {
      try {
        const filePath = `posts/${postId}.jpg`;
        const fileRef = this.storage.ref(filePath);
        await fileRef.put(file);

        const downloadURL = await fileRef.getDownloadURL().toPromise();

        const docRef = this.firestore.collection('post').doc(postId);
        const docSnapshot = await docRef.get().toPromise();
        
        if (docSnapshot && docSnapshot.exists) {
          await docRef.update({ imageUrl: downloadURL });
        } else {
          await docRef.set({ imageUrl: downloadURL });
        }

        this.imageUrls[postId] = downloadURL;  // Mettre à jour l'URL de l'image locale

        console.log('Image mise à jour avec succès');
      } catch (error) {
        console.error('Erreur lors de la sélection de l\'image', error);
      }
    }
  }
}


