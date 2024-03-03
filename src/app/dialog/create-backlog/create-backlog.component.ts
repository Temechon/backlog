import { Component } from '@angular/core';
import { DialogComponent } from '../dialog.component';
import { EditableTextComponent } from '../../gui/editable-text/editable-text.component';

@Component({
  selector: 'create-backlog',
  standalone: true,
  imports: [EditableTextComponent],
  templateUrl: './create-backlog.component.html'
})
export class CreateBacklogComponent extends DialogComponent {

  infos = {
    title: ""
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
