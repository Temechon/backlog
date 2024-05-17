import { Component } from '@angular/core';
import { Meal } from '../../model/meal.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutocompleteComponent } from '../../gui/autocomplete/autocomplete.component';
import { Ingredient } from '../../model/ingredient.model';
import { DatabaseService } from '../../services/database.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-add-meal-view',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, AutocompleteComponent],
  templateUrl: './add-meal-view.component.html',
  styleUrl: './add-meal-view.component.scss'
})
export class AddMealViewComponent {

  meal: Meal;
  allIngredients: Ingredient[] = []

  constructor(private db: DatabaseService) {

  }

  ngOnInit() {
    this.meal = new Meal();

    // Retrieves all ingredient from database
    this.db.getAllIngredients().pipe(first()).subscribe(
      data => {
        this.allIngredients = data;
      }
    )
  }

  addIngredient($event: any) {
    console.log("Ingrédient ajouté !", $event);

    this.meal.ingredients.push($event)
  }


}
