import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private auth: Auth) { }

  getUserId(): Observable<string | null> {
    // return authState(this.auth).pipe(
    //   map(user => user ? user.uid : null)
    // );
    return of("julian");
  }
}
