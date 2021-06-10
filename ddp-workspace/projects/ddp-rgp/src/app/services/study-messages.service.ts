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
          .sort((a, b) => b.date.getTime() - a.date.getTime()),
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

        return this.makeMessage(
          messageConfiguration.baseKey,
          messageConfiguration.stageKey,
          dateStr,
        );
      }
    });
  }

  private makeMessage(
    baseKey: string,
    stageKey: string,
    date: string,
  ): StudyMessage {
    const messageTranslateKey = `${this.BASE_TRANSLATE_KEY}.${baseKey}.${stageKey}`;

    return {
      date: new Date(date),
      message: `${messageTranslateKey}.Message`,
      subject: `${messageTranslateKey}.Subject`,
      more: `${messageTranslateKey}.More`,
    };
  }
}
