import { Component, Input } from '@angular/core';

import { StudyMessage } from '../../models/StudyMessage';

@Component({
  selector: 'app-study-messages',
  templateUrl: './study-messages.component.html',
  styleUrls: ['./study-messages.component.scss'],
})
export class StudyMessagesComponent {
  @Input() messages: StudyMessage[] = [];
  displayedColumns = ['date', 'title', 'description'];
  showMoreMap: Record<string, boolean> = {};

  toggleShowMore({ description }: StudyMessage): void {
    const shown = !!this.showMoreMap[description];

    this.showMoreMap[description] = !shown;
  }
}
