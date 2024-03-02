import { Component } from '@angular/core';
import { DialogComponent } from '../dialog.component';

@Component({
  selector: 'create-backlog',
  standalone: true,
  imports: [],
  templateUrl: './create-backlog.component.html'
})
export class CreateBacklogComponent extends DialogComponent {

  infos = {
    cols: []
  }

  ngOnInit() {
  }

  override close() {
    super.close()
  }

  closeAndCreate() {
    super.close(this.infos);
  }

}
