import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { shortid } from '../../app.component';
import { CreateBacklogComponent } from '../../dialog/create-backlog/create-backlog.component';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private dialog: DialogService,
    private router: Router
  ) { }

  create() {

    let dialogref = this.dialog.openDialog(CreateBacklogComponent);

    dialogref.onClose.subscribe((data?: any) => {
      if (!data) {
        return;
      }
      // Create small guid
      const id = shortid();
      console.log("id", id);

      this.router.navigate(['/backlog', id])
    })
  }

}
