import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Meal } from '../../model/meal.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-meals-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meals-view.component.html',
  styleUrl: './meals-view.component.scss'
})
export class MealsViewComponent {

  filteredMeals: Array<Meal> = [];

  constructor(private db: DatabaseService) {

  }

  toggleCategory(categ: string, event: any) {

  }

  ngOnInit() {
    // Retrieve all meals from database
    this.db.getAllMeals().subscribe(data => {
      for (let d of data) {
        this.filteredMeals.push(new Meal(d['name']))
      }
    })

  }

}
