import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { UserStatusServiceAgent } from 'ddp-sdk';

import { StudyMessage } from '../models/StudyMessage';
import { Workflow } from '../models/Workflow';
import { studyMessagesConfiguration } from '../constants/study-messages';

@Injectable({
  providedIn: 'root',
})
export class StudyMessagesService {
  private readonly BASE_TRANSLATE_KEY = 'StudyMessages';

  constructor(private userStatusService: UserStatusServiceAgent) {}

  getMessages(): any {
    return this.userStatusService.getStatus().pipe(
      map(response =>
        this.convertWorkflowsToStudyMessages(response.workflows)
          .filter(message => !!message)
          .sort((a, b) => {
            // We sort by the Date display column, which is the `date` property.
            // In case of ties, we fallback to the timestamp of the workflow status.
            if (b.date.getTime() === a.date.getTime()) {
              return b.timestamp.getTime() - a.timestamp.getTime();
            } else {
              return b.date.getTime() - a.date.getTime();
            }
          }),
      ),
    );
  }

  private convertWorkflowsToStudyMessages(
    workflows: Workflow[],
  ): StudyMessage[] {
    return studyMessagesConfiguration.map(messageConfiguration => {
      const workflow = workflows.find(
        w =>
          w.workflow === messageConfiguration.workflowKey &&
          messageConfiguration.condition(w),
      );

      let additionalCondition = true;

      if (messageConfiguration.additionalCondition) {
        additionalCondition =
          messageConfiguration.additionalCondition(workflows);
      }

      if (workflow && additionalCondition) {
        let dateStr = workflow.date;

        if (messageConfiguration.dateWorkflowKey) {
          const dateWorkflow = workflows.find(
            w => w.workflow === messageConfiguration.dateWorkflowKey,
          );

          dateStr = dateWorkflow?.status ?? dateStr;
        }

        // The original workflow date should be a full datetime with UTC timezone.
        const timestamp = workflow.date;

        // The `date` is used for table display and should only show month/day/year.
        // It might be a simple date or a full timestamp, so we transform it here.
        if (dateStr.indexOf('T') > 0) {
          dateStr = dateStr.split('T')[0];
        }

        return this.makeMessage(
          messageConfiguration.baseKey,
          messageConfiguration.stageKey,
          timestamp,
          dateStr,
        );
      }
    });
  }

  private makeMessage(
    baseKey: string,
    stageKey: string,
    timestamp: string,
    date: string,
  ): StudyMessage {
    const messageTranslateKey = `${this.BASE_TRANSLATE_KEY}.${baseKey}.${stageKey}`;

    return {
      // Using raw Date() constructor will implicitly convert to local timezone,
      // since the date doesn't have a time portion, and might result in a date
      // that is "off-by-one". To avoid this, we explicitly split the string
      // and create a Date from the components.
      date: this.convertDateString(date),
      // The timestamp is assumed to be a full datetime with UTC timezone,
      // therefore using the raw Date() constructor should be safe.
      timestamp: new Date(timestamp),
      message: `${messageTranslateKey}.Message`,
      subject: `${messageTranslateKey}.Subject`,
      more: `${messageTranslateKey}.More`,
    };
  }

  private convertDateString(date: string): Date {
      const fields = date.split('-');
      const year = parseInt(fields[0], 10);
      const month = parseInt(fields[1], 10) - 1;
      const day = parseInt(fields[2], 10);
      return new Date(year, month, day);
  }
}
