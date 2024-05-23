import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { WeekService } from '../../services/week.service';
import { first } from 'rxjs';
import { Week } from '../../model/week.model';

@Component({
  selector: 'app-shop-list-view',
  standalone: true,
  imports: [],
  templateUrl: './shop-list-view.component.html',
  styleUrl: './shop-list-view.component.scss'
})
export class ShopListViewComponent {

  constructor(
    private db: DatabaseService,
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
    this.weekService.testSnapshot().subscribe(data => console.log(data))
  }

}
