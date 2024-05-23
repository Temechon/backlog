import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatabaseService } from '../../../services/database.service';
import { Observable, first } from 'rxjs';
import { Week } from '../../../model/week.model';
import { WeekService } from '../../../services/week.service';
import { DayViewComponent } from '../../../gui/day-view/day-view.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

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


  constructor(
    private weekService: WeekService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {

    const weekid = this.route.snapshot.paramMap.get('weekid');
    if (weekid) {
      this.week$ = this.weekService.getWeekById(weekid)
      this.week$.subscribe(d => console.log("week from db", d))
    }

    // Get current day
    const daysOfWeek = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const today = new Date();
    this.currentday = daysOfWeek[today.getDay()];
  }

  newWeek() {

  }
}
