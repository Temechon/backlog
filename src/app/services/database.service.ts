import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, combineLatest, first, forkJoin, from, map, of, switchMap, tap } from 'rxjs';
import * as _ from 'underscore';
import { Ingredient } from '../model/ingredient.model';
import { Dish } from '../model/meal.model';

import { ShoppingList } from '../model/shoppinglist.model';
import { Week } from '../model/week.model';
import { AuthentificationService } from './authentification.service';
import { ShoppingListService } from './shoppinglist.service';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {


  private firestore: Firestore = inject(Firestore);

  constructor(
    private authService: AuthentificationService,
    private shopService: ShoppingListService
  ) {
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
          return from(setDoc(mealDocRef, meal.toJson()));
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
            switchMap(() => this.removeDishFromWeeks(userId, dish.id))
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
            switchMap(() => this.removeIngredientFromDishes(userId, ing.id)),
            switchMap(() => this.removeIngredientFromWeeks(userId, ing.id))
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
  private removeIngredientFromDishes(userId: string, ingredientId: string): Observable<any> {
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
        }
      )
    );
  }

  private updateIngredientInDishes(userId: string, ingredient: Ingredient): Observable<any> {
    const dishesCollectionRef = collection(this.firestore, `users/${userId}/dishes`);

    return collectionData(dishesCollectionRef).pipe(
      map(
        dishesSnapshot => {
          const updateDishesObservables = dishesSnapshot.map(dishDoc => {
            const dish = new Dish(dishDoc);
            console.log("updateIngredientInDishes -> Dish", dish);
            dish.updateIngredient(ingredient);

            // const isPresent = _.findIndex(dish.ingredients, ing => ing.id === ingredient.id);
            // console.log("is ingredient present", isPresent)
            // if (isPresent >= 0) {
            //   // console.log("Ingredient found in dish", dish.name);
            //   dish.ingredients[isPresent] = ingredient;
            const dishDocRef = doc(this.firestore, `users/${userId}/dishes/${dish.id}`);
            return from(setDoc(dishDocRef, dish.toJson()));
            // }
            // return of('');
          });

          console.log(updateDishesObservables);

          return forkJoin(updateDishesObservables);
        }
      )
    );
  }

  private updateIngredientInWeeks(userId: string, ing: Ingredient): Observable<any> {
    const weeksCollection = collection(this.firestore, `users/${userId}/weeks`);

    return collectionData(weeksCollection).pipe(
      map(
        weekArray => {
          const updateWeeks = weekArray.map(weekObj => {
            const week = new Week(weekObj);
            week.updateIngredient(ing);
            const weekDocRef = doc(this.firestore, `users/${userId}/weeks/${week.id}`);
            return from(setDoc(weekDocRef, week.toJson()));
          })
          return forkJoin(updateWeeks);
        }
      )
    )
  }

  private updateIngredientInShoppinglist(userId: string, ing: Ingredient): Observable<any> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return docData(userRef).pipe(
      map(user => user['shoplist']),
      map(shoplist => new ShoppingList(shoplist)),
      map(shoplist => {
        shoplist.updateIngredient(ing);
        return from(updateDoc(userRef, { shoplist: shoplist.toJson() }));
      }),
    );
  }

  /**
   * Removes the given dish from all meals of all past weeks
   */
  private removeDishFromWeeks(userId: string, dishid: string): Observable<any> {
    const weeksCollection = collection(this.firestore, `users/${userId}/weeks`);

    return collectionData(weeksCollection).pipe(
      map(
        weekArray => {
          const updateWeeks = weekArray.map(weekObj => {
            const week = new Week(weekObj);
            week.days.map(day => {
              if (day.lunch.mainDish?.id === dishid) {
                day.lunch.mainDish = null;
              } if (day.dinner.mainDish?.id === dishid) {
                day.dinner.mainDish = null;
              }
            })

            const weekDocRef = doc(this.firestore, `users/${userId}/weeks/${week.id}`);
            return from(setDoc(weekDocRef, week.toJson()));
          })
          return forkJoin(updateWeeks);
        }
      )
    )
  }

  /**
   * Removes the given ingredient from all meals of all past weeks
   */
  private removeIngredientFromWeeks(userId: string, ingid: string): Observable<any> {
    const weeksCollection = collection(this.firestore, `users/${userId}/weeks`);

    return collectionData(weeksCollection).pipe(
      map(
        weekArray => {
          const updateWeeks = weekArray.map(weekObj => {
            const week = new Week(weekObj);
            week.days.map(day => {
              day.lunch.ingredients = day.lunch.ingredients.filter(i => i.id !== ingid);
              day.dinner.ingredients = day.dinner.ingredients.filter(i => i.id !== ingid);
            })

            const weekDocRef = doc(this.firestore, `users/${userId}/weeks/${week.id}`);
            return from(setDoc(weekDocRef, week.toJson()));
          })
          return forkJoin(updateWeeks);
        }
      )
    )
  }



  public saveIngredient(ing: Ingredient): Observable<void> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const ingDocRef = doc(this.firestore, `users/${userId}/ingredients/${ing.id}`);
          return from(setDoc(ingDocRef, ing.toJson())).pipe(
            switchMap(() => this.updateIngredientInDishes(userId, ing)),
            switchMap(() => this.updateIngredientInWeeks(userId, ing)),
            switchMap(() => this.updateIngredientInShoppinglist(userId, ing)),
          )
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
