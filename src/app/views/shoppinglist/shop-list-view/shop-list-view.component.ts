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
import { ShoppingItem, ShoppingList } from '../../../model/shoppinglist.model';

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
  // selected category to add an item to the list
  selectedCategory: string
  onCategoryChange(event: any): void {
    this.selectedCategory = event.target.value;
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
        shoplist => {
          this.accordionState = new Array(shoplist.length).fill(true);
          return this.shopService.saveShoppingList(shoplist)
        }
      ),
      first()
    ).subscribe();

    this.ingredients$.pipe(first()).subscribe(shoplist => {
      this.accordionState = new Array(shoplist.length).fill(true);
    });
  }

  /**
   * Adds an item to the shopping list.
   * @returns 
   */
  createItem(ingname: string) {
    if (!ingname) {
      return;
    }
    const newItem = new ShoppingItem({
      ingredient: new Ingredient({ name: ingname, shopCategory: this.selectedCategory }),
      checked: false
    });
    this.shopService.updateShoppingList(newItem, this.selectedCategory).pipe(first()).subscribe()
  }

  addItem(ing: Ingredient) {
    const newItem = new ShoppingItem({
      ingredient: ing,
      checked: false
    });
    this.shopService.updateShoppingList(newItem, this.selectedCategory).pipe(first()).subscribe()
  }

  save($event: ShoppingList) {
    this.shopService.saveShoppingList($event).pipe(first()).subscribe()
  }

  // Remove the whole list and start a new one
  newList() {
    this.shopService.clearShoppingList().pipe(first()).subscribe()
  }

}