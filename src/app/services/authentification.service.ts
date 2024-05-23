import { Injectable, inject } from '@angular/core';
import { Auth, authState, getAuth, onAuthStateChanged, user } from '@angular/fire/auth';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private auth = inject(Auth);

  constructor() { }

  getUserId(): Observable<string> {

    // return user(this.auth);

    return of("julian");
  }
}
