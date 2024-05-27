import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { first } from 'rxjs';
import { Ingredient } from '../../model/ingredient.model';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutocompleteComponent } from '../../gui/autocomplete/autocomplete.component';

@Component({
  selector: 'app-ingredient-view',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, AutocompleteComponent],
  templateUrl: './ingredient-view.component.html',
  styleUrl: './ingredient-view.component.scss'
})
export class IngredientViewComponent {

  ingredient: Ingredient;
  successMessage: string;

  constructor(private db: DatabaseService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.ingredient = new Ingredient();

    // Check if an ID is provided in the route
    this.route.paramMap.subscribe(params => {
      const id = params.get('iding');

      if (id) {
        this.db.getIngredientById(id).pipe(first()).subscribe(
          ing => {
            this.ingredient = ing;
          }
        );
      }
    });
  }


  save() {
    this.db.saveIngredient(this.ingredient).subscribe({
      next: () => {
        this.successMessage = "L'ingrédient a bien été ajouté !";
        setTimeout(() => {
          this.router.navigate(['/meals']);
        }, 1000);
      },
      error: (err) => console.error('Error saving meal:', err)
    });
  }
}
