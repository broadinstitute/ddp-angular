import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Statistic } from '../../models/statistic';
import { SessionServiceAgent } from './sessionServiceAgent.service';

@Injectable()
export class StatisticsServiceAgent<T> extends SessionServiceAgent<
  Statistic<T>[]
> {
  getStatistics(): Observable<Statistic<T>[]> {
    return this.getObservable(
      `/studies/${this._configuration.studyGuid}/statistics`
    );
  }
}
