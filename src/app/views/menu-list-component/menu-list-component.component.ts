import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-menu-list-component',
  standalone: true,
  imports: [],
  templateUrl: './menu-list-component.component.html',
  styleUrl: './menu-list-component.component.scss'
})
export class MenuListComponentComponent {


  constructor(private db: DatabaseService) {
    const doc = this.db.getCurrentMenu();

    doc.then(data => {
      console.log("doc", data.data())
    });
    // doc.subscribe(data => {
    //   console.log("doc", data)
    // })
  }


}
