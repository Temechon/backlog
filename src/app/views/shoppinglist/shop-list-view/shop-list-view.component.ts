import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';
import * as _ from 'underscore';
import { CapitalizeSpacesPipe } from '../../../capitalizeSpaces.pipe';
import { AutocompleteComponent } from '../../../gui/autocomplete/autocomplete.component';
import { Ingredient } from '../../../model/ingredient.model';
import { WeekService } from '../../../services/week.service';

@Component({
  selector: 'app-shop-list-view',
  standalone: true,
  imports: [CommonModule, CapitalizeSpacesPipe, FormsModule, AutocompleteComponent],
  templateUrl: './shop-list-view.component.html',
  styleUrl: './shop-list-view.component.scss'
})
export class ShopListViewComponent {

  ingredients$: Observable<IngredientGroup>;
  shoplist: Array<{ shopCategory: string, item: string }> = [];
  newIngredientName: { [key: string]: string } = {};

  constructor(
    private weekService: WeekService) {
  }


  accordionState: boolean[] = [];
  toggleAccordion(index: number) {
    this.accordionState[index] = !this.accordionState[index];
  }

  ngOnInit() {


    this.ingredients$ = this.weekService.getAllIngredientFromWeek().pipe(
      map((ingredients: Ingredient[]) => new IngredientGroup(_.groupBy(ingredients, "shopCategory")))
      // tap(d => console.log(d))
    )


    this.ingredients$.subscribe(data => {
      this.accordionState = new Array(data.length).fill(true);
    });
  }

  addIngredient(group: IngredientGroup, category: string) {
    const name = this.newIngredientName[category];
    if (name && name.trim()) {
      group.addIngredient(name.trim(), category);
      this.newIngredientName[category] = ''; // Clear the input field after adding
    }
  }

}

class IngredientGroup {

  constructor(private ingredientsByCategory: { [key: string]: Ingredient[] } = {}) {
  }

  [Symbol.iterator]() {
    const categories = Object.keys(this.ingredientsByCategory);
    let index = 0;
    const ingredientsByCategory = this.ingredientsByCategory;

    return {
      next(): IteratorResult<{ shopCategory: string; ingredients: Ingredient[] }> {
        if (index < categories.length) {
          const shopCategory = categories[index++];
          return { value: { shopCategory, ingredients: ingredientsByCategory[shopCategory] }, done: false };
        } else {
          return { value: null, done: true };
        }
      }
    };
  }

  get length(): number {
    return Object.keys(this.ingredientsByCategory).length;
  }

  addIngredient(name: string, shopCategory: string) {
    const newIngredient = new Ingredient({
      name: name,
      shopCategory: shopCategory
    });

    if (!this.ingredientsByCategory[shopCategory]) {
      this.ingredientsByCategory[shopCategory] = [];
    }
    this.ingredientsByCategory[shopCategory].push(newIngredient);
  }
}