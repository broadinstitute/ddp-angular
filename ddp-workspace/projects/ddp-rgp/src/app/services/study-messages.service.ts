import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { UserStatusServiceAgent } from 'ddp-sdk';

import { StudyPerson } from '../models/StudyPerson';
import { StudyMessage } from '../models/StudyMessage';
import { Workflow } from '../models/Workflow';
import { studyMessagesConfiguration } from '../constants/study-messages';

@Injectable({
  providedIn: 'root',
})
export class StudyMessagesService {
  private readonly BASE_TRANSLATE_KEY = 'StudyMessages';

  constructor(private userStatusService: UserStatusServiceAgent) {}

  getPersonMessages(): any {
    return this.userStatusService.getStatus().pipe(
      map(response => {
        const allWorkflows: Workflow[] = response?.workflows ?? [];

        const persons = new Map<string, StudyPerson>();
        const personWorkflows = new Map<string, Workflow[]>();

        for (const workflow of allWorkflows) {
          const subjectId = workflow.data?.subjectId ?? '';
          if (personWorkflows.has(subjectId)) {
            personWorkflows.get(subjectId).push(workflow);
          } else {
            const firstName = workflow.data?.firstname ?? '';
            const lastName = workflow.data?.lastname ?? '';
            const person = { subjectId, firstName, lastName, messages: [] };
            persons.set(subjectId, person);
            personWorkflows.set(subjectId, [workflow]);
          }
        }

        for (const [subjectId, workflows] of personWorkflows) {
          let messages = this.convertWorkflowsToStudyMessages(workflows)
            .filter(message => !!message)
            .sort((a, b) => {
              // We first sort by `date` column (getTime()) for simplicity.
              // Some messages might have the same date, so we sort by `group`
              // so that we follow more-or-less the spreadsheet order. Lastly,
              // if they're in the same group, we use the timestamp.
              if (b.date.getTime() === a.date.getTime()) {
                if (b.group === a.group) {
                  return b.timestamp.getTime() - a.timestamp.getTime();
                } else {
                  return b.group - a.group;
                }
              } else {
                return b.date.getTime() - a.date.getTime();
              }
            });
          const exclusiveMessage = messages.find(msg => !!msg.exclusive);
          if (exclusiveMessage) {
            messages = [exclusiveMessage];
          }
          persons.get(subjectId).messages = messages;
        }

        return Array.from(persons.values())
          .sort((p1, p2) => p1.firstName.localeCompare(p2.firstName));
      }),
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
          !!messageConfiguration.exclusive,
          messageConfiguration.group,
        );
      }
    });
  }

  private makeMessage(
    baseKey: string,
    stageKey: string,
    timestamp: string,
    date: string,
    exclusive: boolean,
    group: number,
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
      exclusive,
      group,
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
