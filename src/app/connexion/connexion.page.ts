import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import * as firebase from 'firebase/app'; import 'firebase/auth';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
})
export class ConnexionPage implements OnInit {

  dataUser = {
    displayName: '',
    email: '',
    password:''
  };
  default: any;
  email!: '';
  password!:'';
  displayName!: '';
  connected!: boolean;
  public selectedSegment: string = 'Se connecter';
  showPassword = false;
  passwordToggleIcon = 'eye-off-outline';
  showPasswordMessage: boolean = false;


  constructor(
    private fb: Facebook,
    private firestore: AngularFirestore,
    private menu: MenuController,
    private router: Router,
    private afAuth: AngularFireAuth,
  ) { 
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('non connecté');
        this.connected = false;          
        this.menu.close();    
      } else {
        console.log('connecté: ' + auth.uid);
        this.router.navigateByUrl('/tabs');
        this.connected = true;
      }
    })
  }

  async loginWithFacebook() {
    try {
      const response: FacebookLoginResponse = await this.fb.login(['public_profile', 'email']);

      if (response.authResponse) {
        const credential = firebase.default.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
        const result = await this.afAuth.signInWithCredential(credential);
        const user = result.user;
        this.firestore.doc('users/' + user!.uid).set({
          author: user!.uid,
          photoURL: user!.photoURL,
          displayName: user!.displayName,
          email: user!.email,
          date: new Date().toISOString()
        });
        console.log('Connecté avec Facebook !');
      } else {
        console.log('Échec de la connexion Facebook.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new firebase.default.auth.GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      const user = result.user;
      this.firestore.doc('users/' + user!.uid).set({
        author: user!.uid,
        photoURL: user!.photoURL,
        displayName: user!.displayName,
        email: user!.email,
        date: new Date().toISOString()
      });
      // L'utilisateur est maintenant connecté avec Google.
    } catch (error) {
      console.error('Erreur lors de la connexion Google :', error);
    }
  }

  async signInWithGoogle2() {
    try {
      const provider = new firebase.default.auth.GoogleAuthProvider();
      await this.afAuth.signInWithPopup(provider);
      // L'utilisateur est maintenant connecté avec Google.
    } catch (error) {
      console.error('Erreur lors de la connexion Google :', error);
    }
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.target.value,
    console.log(event.target.value)
  }

  togglePassword() {
    this.showPassword = !this.showPassword;

    if(!this.showPassword) {
      this.passwordToggleIcon = 'eye-off-outline';
    } else {
      (this.showPassword)
      this.passwordToggleIcon = 'eye-outline';
    }
  }

  checkPassword() {
    if (typeof this.password === 'string' && this.password.length < 6) {
      this.showPasswordMessage = true;
    } else {
      this.showPasswordMessage = false;
    }
  }

  login() {
    this.afAuth.signInWithEmailAndPassword(this.dataUser.email  || this.dataUser.displayName, this.dataUser.password)
    .then(auth => {
      console.log('utilisateur connecté');
    })
    .catch(err => {
      console.log('Erreur: ' + err);
    });
    this.dataUser = {
      displayName:'',
      email: '',
      password:''
    };
  }


  signUp() {
    this.afAuth.createUserWithEmailAndPassword(this.dataUser.email, this.dataUser.password)
    .then((auth) => {
      console.log('utilisateur connecté');
      this.firestore.doc('users/' + auth.user!.uid).set({
        author: auth.user!.uid,
        displayName: this.displayName,
        email: this.email,
        password: this.password,
        date: new Date().toISOString()
      });
    })
    .catch(err => {
      console.log('Erreur: ' + err);
    });
    this.dataUser = {
      displayName: '',
      email: '',
      password:''
    };
  }

  ngOnInit() {
  }

}
