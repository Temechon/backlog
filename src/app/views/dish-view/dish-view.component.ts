import { Component } from '@angular/core';
import { Dish, Meal } from '../../model/meal.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutocompleteComponent } from '../../gui/autocomplete/autocomplete.component';
import { Ingredient } from '../../model/ingredient.model';
import { DatabaseService } from '../../services/database.service';
import { first } from 'rxjs';

@Component({
  selector: 'dish-view',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, AutocompleteComponent],
  templateUrl: './dish-view.component.html',
})
export class DishViewComponent {

  dish: Dish;
  allIngredients: Ingredient[] = []
  successMessage: string;

  constructor(private db: DatabaseService, private router: Router, private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.dish = new Dish();

    const dishid = this.route.snapshot.paramMap.get("id");
    if (dishid) {
      this.db.getDishById(dishid).pipe(first()).subscribe(
        dishData => {
          this.dish = dishData;
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
    this.dish.ingredients.push($event)
  }

  createNewIngredient($event: string) {
    console.log("Creating new ingredient", $event);
    const ing = new Ingredient({ name: $event });
    this.addIngredient(ing);

    this.db.saveDish(this.dish).pipe(first()).subscribe(() => console.log("repas enregistré"));

    this.db.saveIngredient(ing).pipe(first()).subscribe({
      next: () => {
        return this.router.navigate(['/ingredient', ing.id]);
      },
      error: (err) => console.error("Error saving ingredient", err)
    })
  }

  save() {
    this.db.saveDish(this.dish).pipe(first()).subscribe({
      next: () => {
        this.successMessage = 'Le repas a bien été ajouté !', this.dish;
        setTimeout(() => {
          this.router.navigate(['/meals']);
        }, 1000);
      },
      error: (err) => console.error('Error saving meal:', err)
    });
  }

  deleteIngredient(ing: Ingredient) {
    this.dish.ingredients = this.dish.ingredients.filter(mealingredient => mealingredient.id != ing.id);
    this.db.saveDish(this.dish).pipe(first()).subscribe(void 0);
  }


}
