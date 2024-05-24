import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import * as _ from 'underscore';
import { Ingredient } from '../../model/ingredient.model';
import { WeekService } from '../../services/week.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-list-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-list-view.component.html',
  styleUrl: './shop-list-view.component.scss'
})
export class ShopListViewComponent {

  ingredients$: Observable<any>;

  constructor(
    private weekService: WeekService) {
  }

  ngOnInit() {
    // // Get the current week
    // this.weekService.getCurrentWeek().subscribe(weekid => {
    //   console.log("week id", weekid);

    //   this.weekService.getWeekById(weekid).subscribe((week: Week) => {
    //     // Extract the list of ingredients from all meals of this week
    //     const ingredientsIds = [];
    //     for (let day of week.days) {
    //       if (day.lunch?.ingredients) {
    //         ingredientsIds.push(...day.lunch.ingredients.map(ing => ing.id));
    //       }
    //       if (day.dinner?.ingredients) {
    //         ingredientsIds.push(...day.dinner.ingredients.map(ing => ing.id));
    //       }
    //     }
    //     console.log("ingredients ids", ingredientsIds);


    //   })
    // })
    this.ingredients$ = this.weekService.getAllIngredientFromWeek().pipe(
      map((ingredients: Ingredient[]) => _.toArray(_.groupBy(ingredients, "shopCategory")))
    )

    this.ingredients$.subscribe(data => console.log(data));
  }

}
