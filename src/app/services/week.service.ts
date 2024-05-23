import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Observable, catchError, combineLatest, from, map, of, switchMap } from 'rxjs';
import { Week } from '../model/week.model';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class WeekService {


  private firestore: Firestore = inject(Firestore);

  constructor(
    private authService: AuthentificationService) {
  }

  private listenDoc(reference) {
    return new Observable(observer => {
      return onSnapshot(reference,
        (snapshot => observer.next(snapshot.data())),
        (error => observer.error(error.message))
      );
    });
  }


  testSnapshot() {
    return this.authService.getUserId().pipe(
      switchMap((user: string) => {
        const userDocRef = doc(this.firestore, `users/julian/weeks/week1`);
        return this.listenDoc(userDocRef);
      })
    )
  }

  getAllIngredientFromWeek(weekid: string) {
    return this.getWeekById(weekid).pipe(
      switchMap(week => {
        // Build ingredients of all meals
        const ids = [];
        for (let day of week.days) {
          ids.push(...day?.lunch.ingredients.map(ing => ing.id));
          ids.push(...day?.dinner.ingredients.map(ing => ing.id));
        }
      })
    )
  }



  /**
   * Retrieve the currentWeek attribute for this user
   */
  getCurrentWeek(): Observable<string> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const userDocRef = doc(this.firestore, `users/${userId}`);
          return from(getDoc(userDocRef)).pipe(
            map(userDocSnap => {
              if (userDocSnap.exists()) {
                return userDocSnap.data()['currentWeek'] ?? "";
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

  /**
 * Retrieve a week document by its ID for the authenticated user
 */
  getWeekById(weekId: string): Observable<Week> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const weekDocRef = doc(this.firestore, `users/${userId}/weeks/${weekId}`);
          return this.listenDoc(weekDocRef).pipe(
            map(weekDocSnap => {
              const weekData = new Week(weekDocSnap)
              weekData.id = weekId;
              return weekData;
            })
          );
        } else {
          throw new Error('User is not authenticated');
        }
      }),
      catchError(error => {
        console.error('Authentication error:', error);
        return of(null); // Return null in case of error
      })
    );
  }

  saveWeek(week: Week) {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const weekRef = doc(this.firestore, `users/${userId}/weeks/${week.id}`);
          return from(setDoc(weekRef, week.toJson())).pipe(
            map(() => void 0)
          );
        } else {
          throw new Error('User is not authenticated');
        }
      })
    );
  }

}


