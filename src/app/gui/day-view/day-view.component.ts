import { Component, Input } from '@angular/core';
import { Meal } from '../../model/meal.model';
import { Day } from '../../model/day.model';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'day',
  standalone: true,
  imports: [AutocompleteComponent, RouterModule],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss'
})
export class DayViewComponent {

  @Input() day: Day;

  weekid: string = "";

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.day);
    this.weekid = this.route.snapshot.paramMap.get('weekid');


  }

  addMealToDay(day: Day, mealType: string) {
    return this.router.navigate(["week", this.weekid, day.id, mealType]);
  }
}
