import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { first } from 'rxjs';
import { AutocompleteComponent } from '../../../gui/autocomplete/autocomplete.component';
import { Ingredient } from '../../../model/ingredient.model';
import { DatabaseService } from '../../../services/database.service';

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
  dishid: string = null;

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

    this.dishid = this.route.snapshot.queryParamMap.get('dishid');
  }


  save() {
    this.db.saveIngredient(this.ingredient).subscribe({
      next: () => {
        this.successMessage = "L'ingrédient a bien été ajouté !";
        setTimeout(() => {
          if (this.dishid) {
            this.router.navigate(['/dishes', this.dishid]);
          } else {
            this.router.navigate(['/dishes']);
          }
        }, 1000);
      },
      error: (err) => console.error('Error saving meal:', err)
    });
  }
}
