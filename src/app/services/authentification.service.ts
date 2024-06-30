import { Injectable, inject } from '@angular/core';
import { Auth, authState, getAuth, onAuthStateChanged, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private auth = inject(Auth);

  constructor(private router: Router) {

    console.log("coucou")
    this.getUserId().subscribe(user => {
      if (!user) {
        console.log("user not connected");

        return this.router.navigate(['/home']); // Rediriger vers la page de connexion
      }
    });
  }

  logout() {
    signOut(this.auth).then(() => {
      console.log("Déconnexion réussie");
      this.router.navigate(['/home']); // Rediriger vers la page de connexion après déconnexion
    }).catch(error => {
      console.error("Erreur lors de la déconnexion", error);
    });
  }

  getUserId(): Observable<string> {
    return user(this.auth).pipe(map(user => user?.uid || null));
  }
}
