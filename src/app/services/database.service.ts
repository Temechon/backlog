import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, catchError, combineLatest, first, forkJoin, from, lastValueFrom, map, of, switchMap, tap } from 'rxjs';
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

  /**
   * Retrieves the list of meal for a given user. 
   * Ingredients are not present in the result object.
   */
  private getMeals(userId: string): Observable<Meal[]> {
    const platsCollection = collection(this.firestore, `users/${userId}/meals`);
    return collectionData(platsCollection, { idField: 'id' }).pipe(
      map(data => data.map(meal => new Meal(meal)))
    );
  }

  /**
   * Retrieves a single meal for a given user. 
   * Ingredients are not present in the result object.
   */
  private getMeal(userId: string, mealId: string): Observable<Meal> {
    const mealDoc = doc(this.firestore, `users/${userId}/meals/${mealId}`);
    return docData(mealDoc, { idField: 'id' }).pipe(
      map(ingData => {
        if (ingData) {
          return new Meal(ingData);
        } else {
          throw new Error('Meal not found : ' + mealId);
        }
      })
    );
  }

  /**
   * Returns a single ingredient from the database
   */
  private getIngredient(id: string, userId: string): Observable<Ingredient> {
    const ingredientDoc = doc(this.firestore, `users/${userId}/ingredients/${id}`);
    return docData(ingredientDoc, { idField: 'id' }).pipe(
      map(ingData => {
        if (ingData) {
          return new Ingredient(ingData);
        } else {
          throw new Error('Ingredient not found : ' + id);
        }
      })
    );
  }

  /**
   * Returns a list of ingredient from ids given in parameters
   * @returns 
   */
  private getIngredients(ids: string[], userId: string): Observable<Ingredient[]> {
    if (!ids.length) return of([]);
    const ingredientObservables = ids.map(id => this.getIngredient(id, userId));
    return combineLatest(ingredientObservables);
  }


  /**
   * Returns all meal available for the connected user. ALl meal contains all ingredients (with all data)
   */
  getAllPlatsWithAllIngredients(): Observable<Meal[]> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          return this.getMeals(userId).pipe(
            switchMap(plats => {
              const allIngredientIds = [...new Set(plats.flatMap(plat => plat.ingredients || []).map(ing => ing.id))];
              return this.getIngredients(allIngredientIds, userId).pipe(
                map(ingredients => {
                  return plats.map(plat => {
                    if (plat.ingredients.length === 0) {
                      return plat;
                    }
                    // Find ingredients and filter out undefined values
                    const platIngredients = plat.ingredients
                      .map(id => ingredients.find(ing => ing.id === id.id))
                      .filter(Boolean) as Ingredient[]; // Filter out undefined values

                    // Update plat with filtered ingredients
                    plat.ingredients = platIngredients;
                    return plat;
                  });
                })
              );
            })
          );
        } else {
          throw new Error("User not connected");
        }
      })
    );
  }




  public getCurrentMenu() {

    // Get one document
    return getDoc(doc(this.firestore, 'users/julian'));

    // Get collections
    // return collectionData(collection(this.firestore, 'meals'));
  }

  /**
   * Returns all ingredient for the connected user
   */
  public getAllIngredients() {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const ingredientsCollection = collection(this.firestore, `users/${userId}/ingredients`);
          return collectionData(ingredientsCollection, { idField: 'id' }).pipe(
            tap(data => console.log(data))).pipe(
              map(ingredients => ingredients.map(ing => new Ingredient(ing)))
            ) as Observable<Ingredient[]>;
        } else {
          return of([]); // Handle the case where the user is not authenticated
        }
      })
    );
  }

  /**
   * Saves a meal to Firestore. If a meal with the same ID already exists,
   * it updates the existing meal. Otherwise, it creates a new meal document.
   */
  public saveMeal(meal: Meal): Observable<void> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const mealDocRef = doc(this.firestore, `users/${userId}/meals/${meal.id}`);
          return from(setDoc(mealDocRef, meal.toJson())).pipe(
            map(() => void 0)
          );
        } else {
          throw new Error('User is not authenticated');
        }
      })
    );
  }

  public deleteMeal(meal: Meal): Observable<void> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const mealDocRef = doc(this.firestore, `users/${userId}/meals/${meal.id}`);
          return from(deleteDoc(mealDocRef)).pipe(
            map(() => void 0)
          );
        } else {
          throw new Error('User is not authenticated');
        }
      })
    );
  }


  public saveIngredient(ing: Ingredient): Observable<void> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const ingDocRef = doc(this.firestore, `users/${userId}/ingredients/${ing.id}`);
          return from(setDoc(ingDocRef, ing.toJson())).pipe(
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
          return this.getMeal(userId, mealId).pipe(
            switchMap(plat => {
              if (plat.ingredients.length === 0) {
                return of(plat); // If no ingredients, return the plat as is
              }
              const ingredientIds = plat.ingredients.map(ing => ing.id);
              console.log("id from meal", ingredientIds);

              return this.getIngredients(ingredientIds, userId).pipe(
                map(ingredients => {
                  const platIngredients = plat.ingredients
                    .map(id => ingredients.find(ing => ing.id === id.id))
                    .filter(Boolean) as Ingredient[];

                  plat.ingredients = platIngredients;
                  return plat;
                })
              );
            })
          );
        } else {
          throw new Error("User not connected");
        }
      })
    );
  }


  public getIngredientById(ingId: string): Observable<Ingredient> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const ingDoc = doc(this.firestore, `users/${userId}/ingredients/${ingId}`);
          return docData(ingDoc, { idField: 'id' }).pipe(
            map(ingData => {
              if (ingData) {
                const ing = new Ingredient(ingData);
                return ing;
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
