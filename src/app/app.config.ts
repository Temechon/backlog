import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(
      {
        "projectId": "backlogg-53814",
        "appId": "1:450769072442:web:86f0e717f4db98e6376003",
        "storageBucket": "backlogg-53814.appspot.com",
        "apiKey": "AIzaSyBFkWMrh8-_PbzhU4DzKGMy2wesAE66u6E",
        "authDomain": "backlogg-53814.firebaseapp.com",
        "messagingSenderId": "450769072442"
      }))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore()))
  ]
};
