import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ActivityDynamicOption } from '../../models/activity/activityDynamicOption';
import { UserServiceAgent } from './userServiceAgent.service';

interface GetOptionsResponse {
  results: ActivityDynamicOption[];
}

@Injectable()
export class DynamicSelectAnswerService extends UserServiceAgent<GetOptionsResponse> {
  getOptions(
    questionStableId: string,
  ): Observable<GetOptionsResponse['results']> {
    return this.getObservable(
      `/studies/${this.configuration.studyGuid}/dynamic-question/${questionStableId}`,
    ).pipe(
      take(1),
      map(response => {
        return response === null ? [] : response.results;
      }),
    );
  }
}
