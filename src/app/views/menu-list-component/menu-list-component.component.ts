import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Observable, first } from 'rxjs';
import { Week } from '../../model/week.model';
import { WeekService } from '../../services/week.service';

@Component({
  selector: 'app-menu-list-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-list-component.component.html',
  styleUrl: './menu-list-component.component.scss'
})
export class MenuListComponentComponent {

  days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

  menulist$: Observable<Week>;


  constructor(private db: DatabaseService, private weekService: WeekService) {
  }

  ngOnInit() {
    // Retrieve current menu
    this.menulist$ = this.weekService.getCurrentWeek()


    // doc.then(data => {
    //   console.log("doc", data.data())
    // });
    // doc.subscribe(data => {
    //   console.log("doc", data)
    // })


    // If null, retrieve default parameters

    // Generate a new week with these parameters


  }


}
