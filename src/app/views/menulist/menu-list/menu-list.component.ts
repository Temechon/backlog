import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { WeekService } from '../../../services/week.service';
import { Week } from '../../../model/week.model';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss'
})
export class MenuListComponent {

  constructor(private weekService: WeekService, private router: Router) {

  }

  ngOnInit() {
    this.weekService.getCurrentWeekId().pipe(first()).subscribe(weekid => {
      if (weekid) {
        return this.router.navigate(["/week", weekid])
      } else {
        // Create a new week and forward to it
        const week = new Week();

        this.weekService.updateCurrentWeek(week.id).pipe(first()).subscribe(() => {
          this.weekService.saveWeek(week).pipe(first()).subscribe(() => this.router.navigate(["/week", week.id]))
        })

      }
    });
  }
}