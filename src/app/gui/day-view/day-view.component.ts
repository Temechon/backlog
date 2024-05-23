import { Component, Input } from '@angular/core';
import { Meal } from '../../model/meal.model';
import { Day } from '../../model/day.model';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'day',
  standalone: true,
  imports: [AutocompleteComponent, RouterModule, CommonModule],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss'
})
export class DayViewComponent {

  @Input() day: Day;

  @Input() currentday: boolean = false;

  weekid: string = "";

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.weekid = this.route.snapshot.paramMap.get('weekid');
  }

  addMealToDay(day: Day, mealType: string) {
    return this.router.navigate(["week", this.weekid, day.id, mealType]);
  }
}
