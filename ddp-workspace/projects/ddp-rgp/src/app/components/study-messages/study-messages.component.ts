import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StudyPerson } from '../../models/StudyPerson';
import { StudyMessage } from '../../models/StudyMessage';

@Component({
  selector: 'app-study-messages',
  templateUrl: './study-messages.component.html',
  styleUrls: ['./study-messages.component.scss'],
})
export class StudyMessagesComponent {
  @Input() persons: StudyPerson[] = [];
  displayedColumns = ['date', 'title', 'description'];
  showMoreMap: Record<string, boolean> = {};

  constructor(private translateService: TranslateService) {}

  toggleShowMore({ more }: StudyMessage): void {
    const shown = !!this.showMoreMap[more];

    this.showMoreMap[more] = !shown;
  }

  hasMoreText(key: string): Observable<boolean> {
    return this.translateService
      .get(key)
      .pipe(map(translation => translation !== key));
  }
}
