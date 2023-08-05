import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
interface User {
  displayName: string;
  email: string;
  phoneNumber: string;
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

  image:any;
  imagePath?: string;
  upload: any;

  constructor(
    public afSG: AngularFireStorage,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private camera: Camera
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userDoc: AngularFirestoreDocument<User> = this.firestore.doc<User>(`users/${user.uid}`);
        this.user = userDoc.valueChanges();
      }
    });
  }

  async addPhoto() {
    const libraryImage = await this.openLibrary();
    this.image = 'data:image/jpg;base64,' + libraryImage;
  }

  async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };
    return await this.camera.getPicture(options);
  }

  async uploadFirebase() {
    const loading = await this.loadingController.create({
      duration: 2000
    });
    await loading.present();
    this.imagePath = 'users/' + new Date().getTime() + '.jpg';
    this.upload = this.afSG.ref(this.imagePath).putString(this.image, 'data_url');
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
