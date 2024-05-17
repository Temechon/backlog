import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-meals-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meals-view.component.html',
  styleUrl: './meals-view.component.scss'
})
export class MealsViewComponent {

  filteredMeals: Array<{ mainDish: string, ingredients: Array<{ name: string }> }> = [];

  toggleCategory(categ: string, event: any) {

  }

  ngOnInit() { }

}
