import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, first, forkJoin, map } from 'rxjs';
import { DayViewComponent } from '../../../gui/day-view/day-view.component';
import { Day } from '../../../model/day.model';
import { Week } from '../../../model/week.model';
import { WeekService } from '../../../services/week.service';

@Component({
  selector: 'app-menu-list-component',
  standalone: true,
  imports: [CommonModule, DayViewComponent, RouterModule],
  templateUrl: './week-view.component.html',
  styleUrl: './week-view.component.scss'
})
export class WeekViewComponent {

  week$: Observable<Week>;
  currentday: string = "";
  daysBeforeToday: Array<Day>;


  constructor(
    private weekService: WeekService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {

    // Get current day
    const daysOfWeek = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const today = new Date();
    this.currentday = daysOfWeek[today.getDay()];

    this.route.paramMap.subscribe(params => {

      const weekid = params.get('weekid');
      if (weekid) {
        this.week$ = this.weekService.getWeekById(weekid).pipe(
          map(
            (week: Week) => {
              this.daysBeforeToday = week.setToDay(this.currentday)
              return week;
            }
          )
        );
        this.week$.subscribe(d => console.log("week from db", d))
      }
    })

  }

  newWeek() {
    // creates a new week and update currentweek id
    const newweek = new Week();

    const saveWeek$ = this.weekService.saveWeek(newweek).pipe(first());
    const updateCurrentWeek$ = this.weekService.updateCurrentWeek(newweek.id).pipe(first());

    forkJoin([saveWeek$, updateCurrentWeek$]).subscribe(() => {
      this.router.navigate(['week', newweek.id]);
    })

  }
}
