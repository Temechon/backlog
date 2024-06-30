import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { EmailAuthProvider, GoogleAuthProvider, getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment.development';
import { FirebaseUIModule } from 'firebaseui-angular';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    // {
    //   requireDisplayName: false,
    //   provider: EmailAuthProvider.PROVIDER_ID
    // },
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebaseConfig))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(FirebaseUIModule.forRoot(firebaseUiAuthConfig)),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }
  ]
};
