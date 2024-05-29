import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, combineLatest, forkJoin, from, map, of, switchMap, tap } from 'rxjs';
import * as _ from 'underscore';
import { Ingredient } from '../model/ingredient.model';
import { Dish } from '../model/meal.model';

import { AuthentificationService } from './authentification.service';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {


  private firestore: Firestore = inject(Firestore);

  constructor(
    private authService: AuthentificationService) {
  }


  getAllDishes() {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const dishesCollec = collection(this.firestore, `users/${userId}/dishes`);
          return collectionData(dishesCollec, { idField: 'id' })
            .pipe(
              tap(
                data => console.log("dishes from database", data)
              ),
              map(
                dish => dish.map(d => new Dish(d))
              )
            );
        } else {
          return of([]); // Handle the case where the user is not authenticated
        }
      })
    );
  }

  /**
   * Retrieves a single dish for a given user. 
   * Ingredients are not present in the result object.
   */
  private getDish(userId: string, mealId: string): Observable<Dish> {
    const dishDoc = doc(this.firestore, `users/${userId}/dishes/${mealId}`);
    return docData(dishDoc, { idField: 'id' }).pipe(
      map(ingData => {
        if (ingData) {
          return new Dish(ingData);
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
  public getIngredients(ids: string[], userId: string): Observable<Ingredient[]> {
    if (!ids.length) return of([]);
    const ingredientObservables = ids.map(id => this.getIngredient(id, userId));
    return combineLatest(ingredientObservables);
  }


  /**
   * Returns all meal available for the connected user. ALl meal contains all ingredients (with all data)
   */
  // getAllPlatsWithAllIngredients(): Observable<Meal[]> {
  //   return this.authService.getUserId().pipe(
  //     switchMap(userId => {
  //       if (userId) {
  //         return this.getMeals(userId).pipe(
  //           switchMap(plats => {
  //             const allIngredientIds = [...new Set(plats.flatMap(plat => plat.ingredients || []).map(ing => ing.id))];
  //             return this.getIngredients(allIngredientIds, userId).pipe(
  //               map(ingredients => {
  //                 return plats.map(plat => {
  //                   if (plat.ingredients.length === 0) {
  //                     return plat;
  //                   }
  //                   // Find ingredients and filter out undefined values
  //                   const platIngredients = plat.ingredients
  //                     .map(id => ingredients.find(ing => ing.id === id.id))
  //                     .filter(Boolean) as Ingredient[]; // Filter out undefined values

  //                   // Update plat with filtered ingredients
  //                   plat.ingredients = platIngredients;
  //                   return plat;
  //                 });
  //               })
  //             );
  //           })
  //         );
  //       } else {
  //         throw new Error("User not connected");
  //       }
  //     })
  //   );
  // }


  /**
   * Returns all ingredient for the connected user
   */
  public getAllIngredients() {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const ingredientsCollection = collection(this.firestore, `users/${userId}/ingredients`);
          return collectionData(ingredientsCollection, { idField: 'id' }).pipe(
            tap(data => console.log("ingredient in db", data))).pipe(
              map(ingredients => ingredients.map(ing => new Ingredient(ing)))
            );
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
  public saveDish(meal: Dish): Observable<void> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const mealDocRef = doc(this.firestore, `users/${userId}/dishes/${meal.id}`);
          return from(setDoc(mealDocRef, meal.toJson())).pipe(
            map(() => void 0)
          );
        } else {
          throw new Error('User is not authenticated');
        }
      })
    );
  }

  public deleteDish(dish: Dish): Observable<void> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const mealDocRef = doc(this.firestore, `users/${userId}/dishes/${dish.id}`);
          return from(deleteDoc(mealDocRef)).pipe(
            map(() => void 0)
          );
        } else {
          throw new Error('User is not authenticated');
        }
      })
    );
  }


  public deleteIngredient(ing: Ingredient): Observable<void> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const mealDocRef = doc(this.firestore, `users/${userId}/ingredients/${ing.id}`);
          return from(deleteDoc(mealDocRef)).pipe(
            switchMap(() => this.removeIngredientFromDishes(userId, ing.id))
          );
        } else {
          throw new Error('User is not authenticated');
        }
      })
    );
  }

  /**
   * Removes the given ingredients from all dishes
   */
  private removeIngredientFromDishes(userId: string, ingredientId: string): Observable<void> {
    const dishesCollectionRef = collection(this.firestore, `users/${userId}/dishes`);

    return collectionData(dishesCollectionRef).pipe(
      map(
        dishesSnapshot => {
          const updateDishesObservables = dishesSnapshot.map(dishDoc => {
            const dish = new Dish(dishDoc);
            // console.log("Remove ingredient from Dishes -> Dish", dish);

            const isPresent = _.findIndex(dish.ingredients, ing => ing.id === ingredientId);
            if (isPresent >= 0) {
              // console.log("Ingredient found in dish", dish.name);
              dish.ingredients = dish.ingredients.filter((ing: Ingredient) => ing.id !== ingredientId);
              const dishDocRef = doc(this.firestore, `users/${userId}/dishes/${dish.id}`);
              return from(setDoc(dishDocRef, dish.toJson()));
            }
            return of('');
          });

          return forkJoin(updateDishesObservables);
        }),
      map(() => void 0)
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

  public getDishById(dishId: string): Observable<Dish> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          return this.getDish(userId, dishId).pipe(
            switchMap(dish => {
              if (dish.ingredients.length === 0) {
                return of(dish); // If no ingredients, return the plat as is
              }
              const ingredientIds = dish.ingredients.map(ing => ing.id);
              console.log("getDishById -> ingredients ids", ingredientIds);

              return this.getIngredients(ingredientIds, userId).pipe(
                map(ingredients => {
                  const platIngredients = dish.ingredients
                    .map(id => ingredients.find(ing => ing.id === id.id))
                    .filter(Boolean) as Ingredient[];

                  dish.ingredients = platIngredients;
                  return dish;
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
