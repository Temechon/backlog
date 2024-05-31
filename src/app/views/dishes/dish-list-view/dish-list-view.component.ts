import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, combineLatest, first, map } from 'rxjs';
import { DishListComponent } from '../../../gui/dish-list/dish-list.component';
import { Ingredient } from '../../../model/ingredient.model';
import { Dish } from '../../../model/meal.model';
import { DatabaseService } from '../../../services/database.service';


interface DishListData {
  dishes: Dish[];
  ingredients: Ingredient[];

}

@Component({
  selector: 'app-meals-view',
  standalone: true,
  imports: [CommonModule, RouterModule, DishListComponent],
  templateUrl: './dish-list-view.component.html'
})

export class DishListViewComponent {

  constructor(
    private db: DatabaseService,
    private router: Router,
  ) {

  }

  ngOnInit() {
  }

  addIngredient() {
    return this.router.navigate(['/ingredient'])
  }

  newDish() {
    const dish = new Dish();
    this.db.saveDish(dish).pipe(first()).subscribe(() => this.openDish(dish))
  }

  openDish(item: Dish | Ingredient) {
    if (item instanceof Dish) {
      return this.router.navigate(['/dishes', item.id]);
    } else {
      return this.router.navigate(['/ingredient', item.id]);
    }
  }

  onDelete(item: Dish | Ingredient) {
    if (item instanceof Dish) {
      this.deleteDish(item);
    } else {
      this.deleteIngredient(item);
    }
  }

  deleteDish(dish: Dish) {
    this.db.deleteDish(dish).pipe(first()).subscribe(() => console.log("Repas effacé"));

  }
  deleteIngredient(ing: Ingredient) {
    this.db.deleteIngredient(ing).pipe(first()).subscribe(() => console.log("Ingredient effacé"));

  }
}
