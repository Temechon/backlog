import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
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
  shoplist: Array<string> = [];

  constructor(
    private weekService: WeekService) {
  }

  ngOnInit() {

    this.ingredients$ = this.weekService.getAllIngredientFromWeek().pipe(
      map((ingredients: Ingredient[]) => _.toArray(_.groupBy(ingredients, "shopCategory")))
    )

    this.ingredients$.subscribe(data => console.log(data));
  }

  addShop() {

  }

}
