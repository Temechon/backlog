import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, first, map, of, switchMap } from 'rxjs';
import { AuthentificationService } from './authentification.service';
import { Ingredient } from '../model/ingredient.model';


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
    return collectionData(collection(this.firestore, 'meals')).pipe(first());
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

    // return collectionData(collection(this.firestore, 'ingredients')).pipe(first());
  }
}
