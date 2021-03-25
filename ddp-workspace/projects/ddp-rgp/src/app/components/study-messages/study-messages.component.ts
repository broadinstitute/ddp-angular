import { Component, OnInit } from '@angular/core';

import { StudyMessagesService } from '../../services/study-messages.service';
import { StudyMessage } from '../../models/StudyMessage';

@Component({
  selector: 'app-study-messages',
  templateUrl: './study-messages.component.html',
  styleUrls: ['./study-messages.component.scss'],
})
export class StudyMessagesComponent implements OnInit {
  messages: StudyMessage[] = [];
  displayedColumns = ['date', 'title', 'description'];
  showMoreMap: Record<string, boolean> = {};

  constructor(private studyMessagesService: StudyMessagesService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  toggleShowMore({ description }: StudyMessage): void {
    const shown = !!this.showMoreMap[description];

    this.showMoreMap[description] = !shown;
  }

  private loadMessages(): void {
    this.studyMessagesService.getMessages().subscribe(messages => {
      console.log(messages);

      this.messages = messages;
    });
  }
}
