import {Component, Input} from '@angular/core';

import { AnnouncementMessage } from 'ddp-sdk';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  @Input() messages: AnnouncementMessage[];
  private hiddenMap: Record<string, boolean> = {};

  isMessageShown({ guid }: AnnouncementMessage): boolean {
    return !this.hiddenMap[guid];
  }

  hideMessage({ guid }: AnnouncementMessage): void {
    this.hiddenMap[guid] = true;
  }
}
