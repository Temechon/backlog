import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {


  private firestore: Firestore = inject(Firestore);

  constructor() {
  }

  public getBacklog(id: string) {

    // return this.db.collection('backlog').doc(id).valueChanges();
    return getDoc(doc(this.firestore, 'backlog/' + id));
    // return collectionData(collection(this.firestore, 'backlog'), { idField: 'id' })

  }
}
