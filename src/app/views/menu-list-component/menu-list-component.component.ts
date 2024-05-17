import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-menu-list-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-list-component.component.html',
  styleUrl: './menu-list-component.component.scss'
})
export class MenuListComponentComponent {

  days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]


  constructor(private db: DatabaseService) {
  }

  ngOnInit() {
    // Retrieve current menu
    const doc = this.db.getCurrentMenu();

    doc.then(data => {
      console.log("doc", data.data())
    });
    // doc.subscribe(data => {
    //   console.log("doc", data)
    // })


    // If null, retrieve default parameters

    // Generate a new week with these parameters


  }


}
