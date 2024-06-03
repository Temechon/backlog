import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, filter, first, map, switchMap, tap } from 'rxjs';
import * as _ from 'underscore';
import { CapitalizeSpacesPipe } from '../../../capitalizeSpaces.pipe';
import { AutocompleteComponent } from '../../../gui/autocomplete/autocomplete.component';
import { Ingredient } from '../../../model/ingredient.model';
import { WeekService } from '../../../services/week.service';
import { ShoppingListService } from '../../../services/shoppinglist.service';
import { ShoppingList } from '../../../model/shoppinglist.model';

@Component({
  selector: 'app-shop-list-view',
  standalone: true,
  imports: [CommonModule, CapitalizeSpacesPipe, FormsModule, AutocompleteComponent],
  templateUrl: './shop-list-view.component.html',
  styleUrl: './shop-list-view.component.scss'
})
export class ShopListViewComponent {

  ingredients$: Observable<ShoppingList>;
  newIngredientName: { [key: string]: string } = {};

  constructor(
    private weekService: WeekService, private shopService: ShoppingListService) {
  }

  // Accordion
  accordionState: boolean[] = [];
  toggleAccordion(index: number) {
    this.accordionState[index] = !this.accordionState[index];
  }

  ngOnInit() {

    // Get the current shop list from database, found in users/<userid>/shoplist
    this.ingredients$ = this.shopService.getShoppingList()

    // If shop list length is 0, prefill with the week meals
    this.ingredients$.pipe(
      filter(shoplist => shoplist.length === 0),
      switchMap(
        () => this.weekService.getAllIngredientFromWeek()
      ),
      map(
        ingredientlist => new ShoppingList(_.groupBy(ingredientlist, 'shopCategory'))
      ),
      switchMap(
        shoplist => this.shopService.saveShoppingList(shoplist)
      ),
      first()
    ).subscribe();

    this.ingredients$.pipe(first()).subscribe(shoplist => {
      this.accordionState = new Array(shoplist.length).fill(true);
    });
  }

  addIngredient(group: any, category: string) {
    // const name = this.newIngredientName[category];
    // if (name && name.trim()) {
    //   group.addIngredient(name.trim(), category);
    //   this.newIngredientName[category] = ''; // Clear the input field after adding
    // }
  }

  save($event: ShoppingList) {
    this.shopService.saveShoppingList($event).pipe(first()).subscribe()
  }

}