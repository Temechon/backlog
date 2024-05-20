import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AuthentificationService } from './authentification.service';
import { Observable, switchMap, from, map } from 'rxjs';
import { Week } from '../model/week.model';

@Injectable({
  providedIn: 'root'
})
export class WeekService {


  private firestore: Firestore = inject(Firestore);

  constructor(
    private authService: AuthentificationService) {
  }


  /**
   * Retrieve the menu list for the current week
   */
  getCurrentWeek(): Observable<Week> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const userDocRef = doc(this.firestore, `users/${userId}`);
          return from(getDoc(userDocRef)).pipe(
            switchMap(userDocSnap => {
              if (userDocSnap.exists()) {
                const currentWeekId = userDocSnap.data()['currentWeek'];
                const weekDocRef = doc(this.firestore, `users/${userId}/weeks/${currentWeekId}`);
                return from(getDoc(weekDocRef)).pipe(
                  map(weekDocSnap => new Week(weekDocSnap.data()))
                );
              } else {
                throw new Error('User document not found');
              }
            })
          );
        } else {
          throw new Error('User is not authenticated');
        }
      })
    );
  }




}


