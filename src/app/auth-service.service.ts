import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'; import 'firebase/auth';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  phoneNumber: string = '';
  verificationCode: string = '';
  Code: any;
  private confirmationResult: firebase.default.auth.ConfirmationResult | null = null;
  CountryCode: any = '+241';
  recaptchaVerifier: any = null;

  constructor(
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) {}

  async sendVerificationCode(phoneNumber: string, countryCode: string): Promise<any> {
    const fullPhoneNumber = `+${countryCode}${phoneNumber}`;
    const captchaVerifier = new firebase.default.auth.RecaptchaVerifier('recaptcha-container');
    
    try {
      const confirmationResult = await this.afAuth.signInWithPhoneNumber(fullPhoneNumber, captchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du code de vérification', error);
      throw error;
    }
  }

}
