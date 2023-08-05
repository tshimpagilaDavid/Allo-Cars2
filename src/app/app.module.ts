import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { Camera } from '@ionic-native/camera/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';

const firebaseConfig = {
  apiKey: "AIzaSyBFwYA5g52Ctj4cb_aW bn EFuIA6Aq4bY3E3s",
  authDomain: "allocars-unlimited-futur.firebaseapp.com",
  databaseURL: "https://allocars-unlimited-futur-default-rtdb.firebaseio.com",
  projectId: "allocars-unlimited-futur",
  storageBucket: "allocars-unlimited-futur.appspot.com",
  messagingSenderId: "890770570962",
  appId: "1:890770570962:web:e82bc72c6564c075ccf70b",
  measurementId: "G-QFYGXJ6G69"
}

@NgModule({ 
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
  ],
  providers: [GoogleMaps,Camera,Facebook,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
