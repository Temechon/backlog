import { Component } from '@angular/core';
import { Meal } from '../../model/meal.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutocompleteComponent } from '../../gui/autocomplete/autocomplete.component';
import { Ingredient } from '../../model/ingredient.model';
import { DatabaseService } from '../../services/database.service';
import { first } from 'rxjs';

@Component({
  selector: 'add-meal-view',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, AutocompleteComponent],
  templateUrl: './meal-view.component.html',
  styleUrl: './meal-view.component.scss'
})
export class MealViewComponent {

  meal: Meal;
  allIngredients: Ingredient[] = []
  successMessage: string;
  isEdition: boolean = false;

  constructor(private db: DatabaseService, private router: Router, private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.meal = new Meal();

    const mealid = this.route.snapshot.paramMap.get("id");

    if (mealid) {

      this.db.getMealById(mealid).pipe(first()).subscribe(
        mealData => {
          this.meal = mealData;
          this.isEdition = true;
        }
      );
    }

    // Retrieves all ingredients from database to dsplay in the ingredient list
    this.db.getAllIngredients().pipe(first()).subscribe(
      data => {
        console.log("all ingredients", data);
        this.allIngredients = data;
      }
    );

  }

  addIngredient($event: Ingredient) {
    this.meal.ingredients.push($event)
  }

  createNewIngredient($event: string) {
    console.log("Creating new ingredient", $event);
    const ing = new Ingredient({ name: $event });
    this.addIngredient(ing);

    this.db.saveMeal(this.meal).pipe(first()).subscribe(() => console.log("repas enregistré"));

    this.db.saveIngredient(ing).pipe(first()).subscribe({
      next: () => {
        return this.router.navigate(['/meals', this.meal.id, 'ingredient', ing.id]);
      },
      error: (err) => console.error("Error saving ingredient", err)
    })
  }

  save() {
    this.db.saveMeal(this.meal).pipe(first()).subscribe({
      next: () => {
        this.successMessage = 'Le repas a bien été ajouté !', this.meal;
        setTimeout(() => {
          this.router.navigate(['/meals']);
        }, 1000);
      },
      error: (err) => console.error('Error saving meal:', err)
    });
  }

  deleteIngredient(ing: Ingredient) {
    this.meal.ingredients = this.meal.ingredients.filter(mealingredient => mealingredient.id != ing.id);
    this.db.saveMeal(this.meal).pipe(first()).subscribe(void 0);
  }


}
