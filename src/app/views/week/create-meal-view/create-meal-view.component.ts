import { Component } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { Observable, combineLatest, first, map, switchMap, tap } from 'rxjs';
import { Ingredient } from '../../../model/ingredient.model';
import { Dish, Meal } from '../../../model/meal.model';
import { AutocompleteComponent } from '../../../gui/autocomplete/autocomplete.component';
import * as _ from 'underscore';
import { ActivatedRoute } from '@angular/router';
import { Day } from '../../../model/day.model';
import { WeekService } from '../../../services/week.service';
import { CommonModule } from '@angular/common';
import { Week } from '../../../model/week.model';
import { DishListComponent } from '../../../gui/dish-list/dish-list.component';

@Component({
  selector: 'app-create-meal-view',
  standalone: true,
  imports: [AutocompleteComponent, CommonModule, DishListComponent],
  templateUrl: './create-meal-view.component.html',
  styleUrl: './create-meal-view.component.scss'
})
export class CreateMealViewComponent {

  allDishesAndIngredients: Array<Dish | Ingredient> = [];
  day$: Observable<Day>;
  mealType$: Observable<string>;
  meal$: Observable<Meal>;
  week: Week;
  meal: Meal;

  constructor(
    private db: DatabaseService,
    private route: ActivatedRoute,
    private weekService: WeekService
  ) {

  }

  ngOnInit() {

    // Get ingredients and dishes to make the meal
    combineLatest([this.db.getAllDishes(), this.db.getAllIngredients()])
      .pipe(first()).subscribe(([dishes, ingredients]) => {
        this.allDishesAndIngredients = _.union(dishes, ingredients)
      })

    // Retrieve the day from url
    this.day$ = this.route.paramMap.pipe(
      switchMap(
        params => {
          console.log("route params", params);
          const weekid = params.get('weekid')
          const dayid = params.get('dayid')

          return this.weekService.getWeekById(weekid).pipe(
            map(
              week => {
                this.week = week;
                return week.getDay(dayid)
              }
            )
          )
        }
      )
    )

    // Lunch or dinner
    this.mealType$ = this.route.data.pipe(
      tap(data => console.log("queryparams", data)),
      map(
        queryparams => queryparams['mealType']
      )
    )

    this.meal$ = combineLatest([this.day$, this.mealType$]).pipe(
      map(
        ([day, mealType]) => {
          if (mealType === 'lunch') {
            this.meal = day.lunch;
            return day.lunch;
          } else {
            this.meal = day.dinner;
            return day.dinner;
          }
        }
      )
    )

  }

  addToMeal(event: any) {
    if (event instanceof Dish) {
      this.meal.mainDish = event;
    } else {
      const isNotThereALready = _.findIndex(this.meal.ingredients, i => i.id === event.id)
      if (isNotThereALready === -1) {
        this.meal.ingredients.push(event);
      }
    }
    console.log("week json", this.week.toJson());
    this.weekService.saveWeek(this.week).pipe(first()).subscribe()
  }

  removeFromMeal(ing: Ingredient) {
    this.meal.ingredients = this.meal.ingredients.filter(i => i.id !== ing.id);
    this.weekService.saveWeek(this.week).pipe(first()).subscribe()
  }

}
