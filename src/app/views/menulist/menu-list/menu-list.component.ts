import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { WeekService } from '../../../services/week.service';

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
    this.weekService.getCurrentWeekId().pipe(first()).subscribe(weekid => this.router.navigate(["/week", weekid]));
  }
}