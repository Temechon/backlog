import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, combineLatest, first, map } from 'rxjs';
import { Ingredient } from '../../../model/ingredient.model';
import { Dish } from '../../../model/meal.model';
import { DatabaseService } from '../../../services/database.service';
import { WeekService } from '../../../services/week.service';
import { DishListComponent } from '../../../gui/dish-list/dish-list.component';


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

  filteredDishes: Observable<Dish[]>;
  filteredIngredients: Observable<Ingredient[]>;

  data$: Observable<DishListData>;

  constructor(
    private db: DatabaseService,
    private weekservice: WeekService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  toggleCategory(categ: string, event: any) {
    // todo
  }

  ngOnInit() {
    // Retrieve all meals from database
    // this.db.getAllPlatsWithAllIngredients().pipe(first()).subscribe(data => {
    //   this.filteredMeals = data;
    // })

    // get all dishes and all ingredients
    this.filteredDishes = this.db.getAllDishes();
    this.filteredIngredients = this.db.getAllIngredients();

    this.data$ = combineLatest([this.filteredDishes, this.filteredIngredients])
      .pipe(map(([dishes, ingredients]) => {
        return {
          dishes,
          ingredients
        }
      }))

  }

  addIngredient() {
    return this.router.navigate(['/ingredient'])
  }

  newDish() {
    // if (this.editMode) {
    const dish = new Dish();
    this.db.saveDish(dish).pipe(first()).subscribe(() => this.openDish(dish))
  }
  openDish(dish: Dish) {
    return this.router.navigate(['/dishes', dish.id]);
  }

  deleteDish(dish: Dish, $event) {
    $event.stopPropagation();
    this.db.deleteDish(dish).pipe(first()).subscribe(() => console.log("Repas effacé"));

  }
  deleteIngredient(ing: Ingredient, $event) {
    $event.stopPropagation();
    this.db.deleteIngredient(ing).pipe(first()).subscribe(() => console.log("Ingredient effacé"));

  }
}
