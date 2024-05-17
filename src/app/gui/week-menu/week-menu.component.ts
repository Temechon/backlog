import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'week-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-menu.component.html',
  styleUrl: './week-menu.component.scss'
})
export class WeekMenuComponent {

  days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

}
