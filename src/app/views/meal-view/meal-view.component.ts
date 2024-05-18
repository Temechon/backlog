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

    // Check if an ID is provided in the route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.db.getMealById(id).pipe(first()).subscribe(
          mealData => {
            this.meal = mealData;
            this.isEdition = true;
          }
        );
      }
    });

    // Retrieves all ingredients from database
    this.db.getAllIngredients().pipe(first()).subscribe(
      data => {
        this.allIngredients = data;
      }
    );

  }

  addIngredient($event: any) {
    console.log("Ingrédient ajouté !", $event);

    this.meal.ingredients.push($event)
  }

  save() {
    this.db.saveMeal(this.meal).subscribe({
      next: () => {
        this.successMessage = 'Le repas a bien été ajouté !';
        setTimeout(() => {
          this.router.navigate(['/meals']);
        }, 1000);
      },
      error: (err) => console.error('Error saving meal:', err)
    });
  }


}
