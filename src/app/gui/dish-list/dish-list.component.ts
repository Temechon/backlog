import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { Ingredient } from '../../model/ingredient.model';
import { Dish } from '../../model/meal.model';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { WeekService } from '../../services/week.service';


interface DishListData {
  dishes: Dish[];
  ingredients: Ingredient[];

}

@Component({
  selector: 'dish-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dish-list.component.html',
  styleUrl: './dish-list.component.scss'
})
export class DishListComponent {

  filteredDishes: Observable<Dish[]>;
  filteredIngredients: Observable<Ingredient[]>;

  data$: Observable<DishListData>;

  @Input() canDelete: boolean = true;
  @Output() selectItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();

  constructor(
    private db: DatabaseService,
    private weekservice: WeekService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
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

  toggleCategory(dishType: string, event: Event) {

  }

  onItemSelect(dish: Dish | Ingredient, event: Event) {
    event.stopPropagation();
    this.selectItem.emit(dish);
  }

  onDeleteItem(dish: Dish | Ingredient, event: Event) {
    event.stopPropagation();
    this.deleteItem.emit(dish);
  }
}
