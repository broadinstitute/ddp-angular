import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Statistic } from '../../models/statistic';
import { SessionServiceAgent } from './sessionServiceAgent.service';

@Injectable()
export class StatisticsServiceAgent extends SessionServiceAgent<Statistic[]> {
  getStatistics(): Observable<Statistic[]> {
    return this.getObservable(
      `/studies/${this._configuration.studyGuid}/statistics`
    );
  }
}
