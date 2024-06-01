import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import * as _ from 'underscore';
import { CapitalizeSpacesPipe } from '../../../capitalizeSpaces.pipe';
import { Ingredient } from '../../../model/ingredient.model';
import { WeekService } from '../../../services/week.service';

@Component({
  selector: 'app-shop-list-view',
  standalone: true,
  imports: [CommonModule, CapitalizeSpacesPipe],
  templateUrl: './shop-list-view.component.html',
  styleUrl: './shop-list-view.component.scss'
})
export class ShopListViewComponent {

  ingredients$: Observable<any>;
  shoplist: Array<{ shopCategory: string, item: string }> = [];

  private shopList$ = new BehaviorSubject(this.shoplist);

  constructor(
    private weekService: WeekService) {
  }

  ngOnInit() {

    this.ingredients$ = this.weekService.getAllIngredientFromWeek().pipe(
      // map((ingredients: Ingredient[]) => _.indexBy(ingredients, "shopCategory"))
      tap(d => console.log(d))
    )


    this.ingredients$.subscribe(data => console.log(data));
  }

  addShop() {

  }

}
