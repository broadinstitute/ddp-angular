import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ActivityInstanceSelectOptionDto } from '../../models/activity/activityInstanceSelectOptionDto';
import { UserServiceAgent } from './userServiceAgent.service';

interface GetOptionsResponse {
  results: ActivityInstanceSelectOptionDto[];
}

@Injectable()
export class ActivityInstanceSelectAnswerService extends UserServiceAgent<GetOptionsResponse> {
  getOptions(questionStableId: string): Observable<GetOptionsResponse['results']> {
    return this.getObservable(
      `/studies/${this.configuration.studyGuid}/activity-instance-select/${questionStableId}`,
    ).pipe(
      take(1),
      map(response => {
        return response === null ? [] : response.results;
      }),
    );
  }
}
