import { Component } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { CreateBacklogComponent } from '../../dialog/create-backlog/create-backlog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private dialog: DialogService) { }

  create() {

    let dialogref = this.dialog.openDialog(CreateBacklogComponent);

    dialogref.onClose.subscribe((data?: any) => {
      if (!data) {
        return;
      }
    })
  }

}
