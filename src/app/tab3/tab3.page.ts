import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
interface User {
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  // Ajoutez d'autres propriétés de l'utilisateur si nécessaire
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userId?: string;
  userDoc?: AngularFirestoreDocument<User>;
  user!: Observable<User | undefined>;
  connected: boolean = false;
  photoURL: string | ArrayBuffer | null = null;
  image: string = 'assets/profil.webp';
  selectedFile: any;
  imageClass: string = 'image';
  upload: any;

  constructor(
    public afSG: AngularFireStorage,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userDoc: AngularFirestoreDocument<User> = this.firestore.doc<User>(`users/${user.uid}`);
        this.user = userDoc.valueChanges();
        
        this.user.subscribe(userData => {
          this.photoURL = userData?.photoURL || 'assets/profil.webp';
          this.connected = !!user;
        });
      }
    });
  }

  redirectToLogin() {
    this.router.navigateByUrl('/connexion');
  }

  openGallery() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; // Assignez la valeur de selectedFile à this.selectedFile
    const selectedFile = this.selectedFile;
    
    // Vous pouvez maintenant traiter le fichier sélectionné comme vous le souhaitez
    // Par exemple, vous pouvez afficher l'image dans votre application ou l'enregistrer sur le serveur.
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoURL = reader.result;
        this.imageClass = 'image fit-image';
      };
      reader.readAsDataURL(selectedFile);
    }
    console.log(selectedFile);
  }

  async uploadFirebase() {
    const loading = await this.loadingController.create({
      duration: 2000
    });
    await loading.present();
    this.selectedFile = 'users/' + new Date().getTime() + '.jpg';
    this.upload = this.afSG.ref(this.image).putString(this.image, 'data_url');
    this.upload.then(async () => {
      await loading.onDidDismiss();
      const alert = await this.alertController.create({
        header: 'Félicitation',
        message: 'Cette photo nous permettra de vous identifiez!',
        buttons: ['OK']
      });
      await alert.present();
    });
  }

  uploadPhotoToStorage(userId: string, photoData: string) {
    const storageRef = this.afSG.ref(`users/${userId}/profile-photo.jpg`);
    const photoBlob = this.dataURItoBlob(photoData);

    const uploadTask = storageRef.put(photoBlob);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe((downloadUrl) => {
          // Une fois le téléchargement terminé, vous pouvez obtenir l'URL de téléchargement de la photo
          // Vous pouvez maintenant mettre à jour les données Firestore de l'utilisateur avec cette URL
          this.updateUserData(userId, { photoUrl: downloadUrl });
        });
      })
    ).subscribe();
  }

  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  updateUserData(userId: string, newData: any) {
    this.firestore.collection('users').doc(userId).update(newData)
      .then(() => {
        console.log('Données mises à jour avec succès !');
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour des données :', error);
      });
  }



}
