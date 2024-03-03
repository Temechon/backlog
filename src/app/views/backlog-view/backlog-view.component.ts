import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-backlog-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backlog-view.component.html',
  styleUrl: './backlog-view.component.scss'
})
export class BacklogViewComponent {


  constructor(private db: DatabaseService) {
    const doc = this.db.getBacklog("LRtuRcPiBZyKBqfS3eYL");

    doc.then(data => {
      console.log("doc", data.data())
    });
  }

}
