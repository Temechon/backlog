import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {


  private firestore: Firestore = inject(Firestore);

  constructor() {
  }

  public getCurrentMenu() {

    // Get one document
    return getDoc(doc(this.firestore, 'users/julian'));

    // Get collections
    // return collectionData(collection(this.firestore, 'meals'));
  }
}
