import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Day } from '../../model/day.model';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { WeekService } from '../../services/week.service';
import { first } from 'rxjs';

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

  editMode: string = "";

  weekid: string = "";

  constructor(private router: Router, private route: ActivatedRoute, private weekService: WeekService) { }

  ngOnInit() {
    this.weekid = this.route.snapshot.paramMap.get('weekid');
  }

  addMealToDay(day: Day, mealType: string) {
    return this.router.navigate(["week", this.weekid, day.id, mealType]);
  }

  deleteMeal($event: Event, day: Day) {
    $event.stopPropagation();

    this.weekService.getWeekById(this.weekid).pipe(first()).subscribe(week => {

      if (this.editMode === 'lunch') {
        day.lunch = null;
      } else if (this.editMode === 'dinner') {
        day.dinner = null;
      }
      week.replace(day);

      console.log("avant supp", week);
      this.weekService.saveWeek(week).pipe(first()).subscribe()
      this.editMode = "";
    })

  }

  editMeal($event: Event, mealType: string) {
    $event.stopPropagation();
    if (this.editMode === mealType) {
      this.editMode = "";
    } else {
      this.editMode = mealType;
    }
  }
  onBlur() {
    this.editMode = "";
  }
}
