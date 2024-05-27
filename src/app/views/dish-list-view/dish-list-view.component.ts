import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Meal } from '../../model/meal.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { first } from 'rxjs';
import { WeekService } from '../../services/week.service';
import { Ingredient } from '../../model/ingredient.model';

@Component({
  selector: 'app-meals-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dish-list-view.component.html'
})
export class DishListViewComponent {

  filteredMeals: Array<Meal> = [];
  editMode = false;

  weekid: string = "";
  dayid: string = "";
  mealType: string = "";

  constructor(
    private db: DatabaseService,
    private weekservice: WeekService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    console.log("params", this.route.snapshot.paramMap)
    console.log("data", this.route.snapshot.data);

    this.editMode = this.route.snapshot.data['mode'] === 'edit';

    if (!this.editMode) {
      this.weekid = this.route.snapshot.paramMap.get("weekid");
      this.dayid = this.route.snapshot.paramMap.get("dayid");
      this.mealType = this.route.snapshot.data['mealType'];
    }
  }

  toggleCategory(categ: string, event: any) {

  }

  ngOnInit() {
    // Retrieve all meals from database
    this.db.getAllPlatsWithAllIngredients().pipe(first()).subscribe(data => {
      this.filteredMeals = data;
    })

  }

  addIngredient() {
    return this.router.navigate(['/ingredient'])
  }

  deleteMeal(meal: Meal, $event: Event) {
    console.log("delete meal")
    $event.stopPropagation();
    this.db.deleteMeal(meal).subscribe(() => console.log("Repas effacé"));
  }

  openMeal(meal?: Meal) {
    if (this.editMode) {
      return this.router.navigate(['/meals', "new"]);
    } else {
      // save meal for the selected day
      this.weekservice.getWeekById(this.weekid).pipe(first()).subscribe(week => {
        console.log("week from db", week);
        // local modification
        const day = week.getDay(this.dayid);
        if (this.mealType === "lunch") {
          day.lunch.push(meal);
        } else {
          day.dinner.push(meal);
        }

        this.weekservice.saveWeek(week).pipe(first()).subscribe(() => {
          console.log("Week saved in db")
          // and navigate to the week view
          return this.router.navigate(['/week', this.weekid]);

        });

      })


    }
  }

}
