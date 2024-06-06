import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, catchError, combineLatest, from, map, mergeMap, of, switchMap } from 'rxjs';
import { Week } from '../model/week.model';
import { AuthentificationService } from './authentification.service';
import { DatabaseService } from './database.service';
import * as _ from 'underscore';
import { Ingredient } from '../model/ingredient.model';


@Injectable({
  providedIn: 'root'
})
export class WeekService {


  private firestore: Firestore = inject(Firestore);

  constructor(
    private authService: AuthentificationService,
    private db: DatabaseService) {
  }

  private listenDoc(reference) {
    return new Observable(observer => {
      return onSnapshot(reference,
        (snapshot => observer.next(snapshot.data())),
        (error => observer.error(error.message))
      );
    });
  }


  getAllIngredientFromWeek(): Observable<Ingredient[]> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          return this.getCurrentWeekId().pipe(
            switchMap(weekid => {
              return this.getWeekById(weekid).pipe(
                mergeMap(week => {
                  // Build ingredients of all meals
                  const ingds = [];

                  for (let day of week.days) {
                    const lunch = day.lunch;
                    if (lunch) {
                      ingds.push(...lunch.ingredients);
                      if (lunch.mainDish) {
                        ingds.push(...lunch.mainDish.ingredients);
                      }
                    }

                    const dinner = day.dinner;
                    if (dinner) {
                      ingds.push(...dinner.ingredients);
                      if (dinner.mainDish) {
                        ingds.push(...dinner.mainDish.ingredients);
                      }
                    }
                  }
                  const uniq = _.chain(ingds).compact().uniq("id").value();
                  console.log("Ingredients uniques", uniq);
                  return of(uniq);

                })
              )
            })
          )
        }
      })
    )
  }



  /**
   * Retrieve the currentWeek attribute for this user
   */
  getCurrentWeekId(): Observable<string> {
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
          return from(setDoc(weekRef, week.toJson()));
        } else {
          throw new Error('User is not authenticated');
        }
      })
    );
  }

  updateCurrentWeek(weekid: string) {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const weekRef = doc(this.firestore, `users/${userId}`);
          return from(updateDoc(weekRef, { currentWeek: weekid }));
        } else {
          throw new Error('User is not authenticated');
        }
      })
    );
  }

}


