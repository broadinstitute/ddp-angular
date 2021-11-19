import { Component, Output, EventEmitter, Input } from '@angular/core';

import { Assignee } from './assignee.model';

@Component({
  selector: 'app-assignee',
  templateUrl: './assignee.component.html',
  styleUrls: ['./assignee.component.css']
})
export class AssigneesComponent {
  @Input() assignees: Array<Assignee>;
  @Output() selectedAssignee = new EventEmitter();

  selectAssignee(assignee: Assignee): void {
    this.selectedAssignee.next(assignee);
  }
}
