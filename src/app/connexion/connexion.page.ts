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
    password:'',
    displayNameOrEmail: ''
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

  invite() {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        // L'utilisateur n'est pas connecté, donc naviguez vers la page principale
        this.router.navigateByUrl('/tabs');
      } else {
        // L'utilisateur est déjà connecté, rien à faire
        console.log("L'utilisateur est déjà connecté");
      }
    });
  }

  async loginWithFacebook() {
    try {
      const accessToken = 'votre_jetoon_dacces_ici';
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

  async loginWithFacebook2() {
    try {
      const response: FacebookLoginResponse = await this.fb.login(['public_profile', 'email']);
  
      if (response && response.authResponse) {
        const credential = firebase.default.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
        const fbUser = await this.afAuth.signInWithCredential(credential);
  
        if (fbUser && fbUser.user) {
          // Vérifier si l'utilisateur existe dans Firestore
          const userDoc = await this.firestore.collection('users').doc(fbUser.user.uid).get().toPromise();
  
          if (userDoc!.exists) {
            console.log('Connecté avec Facebook !');
            // L'utilisateur est enregistré dans Firestore, vous pouvez effectuer d'autres actions ici
          } else {
            // L'utilisateur n'existe pas dans Firestore, déconnectez-le et affichez un message d'erreur
            console.log('Cet utilisateur n\'est pas enregistré.');
            await this.afAuth.signOut();
            // Afficher un message à l'utilisateur pour l'inviter à s'inscrire
            // Par exemple, vous pouvez utiliser un service d'alerte ou un composant d'alerte Ionic
            this.showErrorMessage('Veuillez vous inscrire pour accéder à la connexion.');
          }
        } else {
          console.log('Erreur lors de l-authentification Facebook : Utilisateur non trouvé');
        }
      } else {
        console.log('Authentification Facebook échouée.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion Facebook :', error);
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
      const googleUser = await this.afAuth.signInWithPopup(provider);
  
      if (googleUser && googleUser.user) {
        // Vérifier si l'utilisateur existe dans Firestore
        const userDoc = await this.firestore.collection('users').doc(googleUser.user.uid).get().toPromise();
  
        if (userDoc!.exists) {
          console.log('Connecté avec Google !');
          // L'utilisateur est enregistré dans Firestore, vous pouvez effectuer d'autres actions ici
        } else {
          // L'utilisateur n'existe pas dans Firestore, déconnectez-le et affichez un message d'erreur
          console.log('Cet utilisateur n\'est pas enregistré.');
          await this.afAuth.signOut();
          // Afficher un message à l'utilisateur pour l'inviter à s'inscrire
          // Par exemple, vous pouvez utiliser un service d'alerte ou un composant d'alerte Ionic
          this.showErrorMessage('Veuillez vous inscrire pour accéder à la connexion.');
        }
      } else {
        console.log('Authentification Google échouée.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion Google :', error);
    }
  }
  
  showErrorMessage(message: string) {
    // Implémentez ici le code pour afficher un message d'erreur à l'utilisateur
    alert(message);
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
    let credentialPromise: Promise<firebase.default.auth.UserCredential>;
    
    if (this.dataUser.displayNameOrEmail && this.dataUser.password) {
      // Utiliser le displayNameOrEmail pour la connexion
      const isEmailFormat = this.isValidEmail(this.dataUser.displayNameOrEmail);
      if (isEmailFormat) {
        // Utiliser l'email pour la connexion
        credentialPromise = this.afAuth.signInWithEmailAndPassword(this.dataUser.displayNameOrEmail, this.dataUser.password);
      } else {
        // Utiliser le displayName pour la connexion
        credentialPromise = this.afAuth.signInWithEmailAndPassword(this.dataUser.displayNameOrEmail, this.dataUser.password);
      }
    } else {
      console.log('Veuillez saisir votre nom d\'utilisateur ou votre adresse e-mail ainsi que votre mot de passe.');
      return; // Arrêter l'exécution de la fonction si le displayNameOrEmail ou le mot de passe n'est pas fourni
    }
  
    // Exécuter la promesse pour la connexion
    credentialPromise
      .then(auth => {
        console.log('Utilisateur connecté');
      })
      .catch(err => {
        console.log('Erreur lors de la connexion : ' + err);
      });
  
    // Réinitialiser les données utilisateur
    this.dataUser = {
      displayNameOrEmail: '',
      displayName: '',
      email: '',
      password:''
    };
  }
  
  isValidEmail(email: string): boolean {
    // Vérifier si l'adresse email est correctement formatée
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
      displayNameOrEmail: '',
      displayName: '',
      email: '',
      password:''
    };
  }

  ngOnInit() {
  }

}
