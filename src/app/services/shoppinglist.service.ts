import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { AuthentificationService } from './authentification.service';
import { ShoppingList } from '../model/shoppinglist.model';


@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {


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

  getShoppingList(): Observable<ShoppingList> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        return docData(doc(this.firestore, `users/${userId}`))
          .pipe(
            map(user => user['shoplist']),
            map(shoplist => new ShoppingList(shoplist))
          );
      })
    );
  }

  saveShoppingList(shoplist: ShoppingList) {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        const weekRef = doc(this.firestore, `users/${userId}`);
        return from(updateDoc(weekRef, { shoplist: shoplist.toJson() }));
      })
    );
  }

}


