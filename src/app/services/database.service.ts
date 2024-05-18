import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, docData, getDoc } from '@angular/fire/firestore';
import { Observable, first, from, map, of, switchMap } from 'rxjs';
import { AuthentificationService } from './authentification.service';
import { Ingredient } from '../model/ingredient.model';
import { Meal } from '../model/meal.model';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {


  private firestore: Firestore = inject(Firestore);

  constructor(
    private authService: AuthentificationService) {
  }

  public getCurrentMenu() {

    // Get one document
    return getDoc(doc(this.firestore, 'users/julian'));

    // Get collections
    // return collectionData(collection(this.firestore, 'meals'));
  }

  public getAllMeals() {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          console.log("User id ", userId);
          const mealsCollections = collection(this.firestore, `users/${userId}/meals`);
          return collectionData(mealsCollections, { idField: 'id' }).pipe(
            map(meals => meals.map(meal => new Meal(meal)))
          ) as Observable<Meal[]>;
        } else {
          return of([]); // Handle the case where the user is not authenticated
        }
      })
    );
  }

  public getAllIngredients() {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          console.log("User id ", userId);
          const ingredientsCollection = collection(this.firestore, `users/${userId}/ingredients`);
          return collectionData(ingredientsCollection, { idField: 'id' }).pipe(
            map(ingredients => ingredients.map(ing => new Ingredient(ing)))
          ) as Observable<Ingredient[]>;
        } else {
          return of([]); // Handle the case where the user is not authenticated
        }
      })
    );
  }

  public saveMeal(meal: Meal): Observable<void> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const mealsCollection = collection(this.firestore, `users/${userId}/meals`);
          return from(addDoc(mealsCollection, meal.toJson())).pipe(
            map(() => void 0)
          );
        } else {
          throw new Error('User is not authenticated');
        }
      })
    );
  }

  public getMealById(mealId: string): Observable<Meal> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const mealDoc = doc(this.firestore, `users/${userId}/meals/${mealId}`);
          return docData(mealDoc, { idField: 'id' }).pipe(
            map(mealData => {
              if (mealData) {
                const meal = new Meal(mealData);
                return meal;
              } else {
                throw new Error('User is not authenticated');
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
