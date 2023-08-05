import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthServiceService } from '../auth-service.service';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.page.html',
  styleUrls: ['./phone-number.page.scss'],
})
export class PhoneNumberPage implements OnInit {
  
  phoneNumber: string = '';
  CountryJson = environment.CountryJson;
  Code: any;
  CountryCode: any = '+241';
  recaptchaVerifier: any = null;
  public confirmationResult: firebase.auth.ConfirmationResult | null = null;
  verificationCode: string = '';
  connected!: boolean;
  password!:'';
  displayName!: '';


  showPassword = false;
  passwordToggleIcon = 'eye-off-outline';
  showPasswordMessage: boolean = false;

  constructor(
    private menu: MenuController,
    private router: Router,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private authService: AuthServiceService,
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

  async sendVerificationCode() {
    const fullPhoneNumber = `+${this.CountryCode}${this.phoneNumber}`; // Concaténez l'indicatif et le numéro de téléphone
    try {
      this.confirmationResult = await this.authService.sendVerificationCode(this.phoneNumber, this.CountryCode);
      // Le code de vérification a été envoyé avec succès, vous pouvez afficher une interface pour que l'utilisateur entre le code.
    } catch (error) {
      // Gérer l'erreur d'envoi du code de vérification
    }
  }

  async verifyCode(): Promise<void> {
    if (this.confirmationResult && this.verificationCode && this.verificationCode.trim() !== '') {
      try {
        const result = await this.confirmationResult.confirm(this.verificationCode);
        const user = result.user;
        this.firestore.doc('users/' + user!.uid).set({
          displayName: this.displayName,
          password: this.password,
          phoneNumber: this.phoneNumber,
          date: new Date().toISOString()
        });
        // Le code de vérification est valide, redirigez l'utilisateur vers la session ici.
      } catch (error) {
        console.error('Erreur lors de la vérification du code', error);
        // Gérer les erreurs de vérification ici.
      }
    } else {
      console.error('confirmationResult est null ou verificationCode est vide. Assurez-vous qu\'ils sont correctement initialisés.');
      // Gérer le cas où confirmationResult est null ou verificationCode est vide ici.
    }
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

  countryCodeChange(event: any) {
    this.CountryCode = event.detail.value,
    console.log(event.target.value)
  }

  ngOnInit() {
    const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

}
