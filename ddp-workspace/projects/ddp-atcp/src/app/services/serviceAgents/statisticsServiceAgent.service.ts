import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserServiceAgent } from 'ddp-sdk';

export interface Statistic {
  configuration: {
    type: string;
    questionStableId: string | null;
    answerValue: string | null;
  };
  statistics: {
    name: string;
    data: {
      count: string;
      optionDetails: any;
    };
  }[];
}

export type StatisticsResponse = Statistic[];

export enum StatisticTypes {
  Distribution = 'DISTRIBUTION',
  Kits = 'KITS',
  MailingList = 'MAILING_LIST',
  Participants = 'PARTICIPANTS',
  SpecificAnswer = 'SPECIFIC_ANSWER',
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsServiceAgent extends UserServiceAgent<
  StatisticsResponse
> {
  public getStatistics(): Observable<StatisticsResponse> {
    return this.getObservable(
      `/studies/${this.configuration.studyGuid}/statistics`
    );
  }

  protected getBackendUrl(): string {
    return `${this.configuration.backendUrl}/pepper/v1`;
  }
}
