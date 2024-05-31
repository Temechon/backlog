import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Ingredient } from '../../model/ingredient.model';
import { Dish } from '../../model/meal.model';
import { DatabaseService } from '../../services/database.service';


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

  private filters: {
    isVegetarian: boolean,
    isSideDish: boolean,
    isDessert: boolean
  } = {
      isVegetarian: false,
      isSideDish: false,
      isDessert: false,
    }

  private filterSubject = new BehaviorSubject(this.filters);

  constructor(
    private db: DatabaseService
  ) {

  }

  ngOnInit() {
    // get all dishes and all ingredients
    this.filteredDishes = this.db.getAllDishes();
    this.filteredIngredients = this.db.getAllIngredients();

    this.data$ = combineLatest([this.filteredDishes, this.filteredIngredients, this.filterSubject])
      .pipe(map(([dishes, ingredients, filters]) => {

        const filteredDishes = dishes.filter(dish =>
          (!filters.isVegetarian || dish.isVegetarian) &&
          (!filters.isSideDish) &&
          (!filters.isDessert)
        );

        const filteredIngredients = ingredients.filter(ing =>
          (!filters.isVegetarian || !ing.isMeat) &&
          (!filters.isSideDish || ing.isSideDish) &&
          (!filters.isDessert || ing.isDessert)
        );


        return {
          dishes: filteredDishes,
          ingredients: filteredIngredients
        }
      }))
  }

  toggleCategory(category: keyof typeof this.filters, event: Event) {
    event.stopPropagation();
    this.filters[category] = !this.filters[category];
    this.filterSubject.next(this.filters);
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
